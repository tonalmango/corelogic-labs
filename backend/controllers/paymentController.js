const Payment = require('../models/Payment');
const Project = require('../models/Project');
const paypalSDK = require('@paypal/checkout-server-sdk');

// Configure PayPal SDK only if credentials are provided
let client = null;
if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET && 
    process.env.PAYPAL_CLIENT_ID !== 'test' && process.env.PAYPAL_CLIENT_SECRET !== 'test') {
  const { core } = require('@paypal/checkout-server-sdk');
  const Environment = process.env.PAYPAL_MODE === 'live' ? core.LiveEnvironment : core.SandboxEnvironment;
  client = new core.PayPalHttpClient(
    new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  );
}

// @desc    Create PayPal order for payment
// @route   POST /api/payments/create-order
// @access  Private
exports.createPayPalOrder = async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({
        success: false,
        message: 'PayPal is not configured. Please contact administrator.'
      });
    }
    
    const { amount, projectId, description, customerEmail } = req.body;
    
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Create PayPal order
    const request = new paypalSDK.orders.OrdersCreateRequest();
    request.headers['prefer'] = 'return=representation';
    request.body = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: projectId,
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: description || `Payment for ${project.projectName}`
      }],
      payer: {
        email_address: customerEmail
      }
    };
    
    const order = await client.execute(request);
    
    // Create payment record in database
    const payment = await Payment.create({
      projectId,
      amount,
      paymentMethod: 'paypal',
      status: 'pending',
      paypalOrderId: order.result.id,
      customerInfo: {
        email: customerEmail
      },
      description
    });
    
    // Return order ID and approval link
    const approvalUrl = order.result.links.find(link => link.rel === 'approve')?.href;
    
    res.json({
      success: true,
      data: {
        orderId: order.result.id,
        approvalLink: approvalUrl,
        paymentId: payment._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating PayPal order',
      error: error.message
    });
  }
};

// @desc    Capture PayPal payment (called after user approves)
// @route   POST /api/payments/capture
// @access  Private
exports.capturePayPalPayment = async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({
        success: false,
        message: 'PayPal is not configured. Please contact administrator.'
      });
    }
    
    const { orderId } = req.body;
    
    // Capture the order
    const request = new paypalSDK.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    
    const capture = await client.execute(request);
    
    // Update payment record
    const payment = await Payment.findOne({ paypalOrderId: orderId });
    
    if (payment) {
      payment.status = 'completed';
      payment.paidAt = new Date();
      payment.transactionId = capture.result.purchase_units[0].payments.captures[0].id;
      await payment.save();
      
      // Update project deposit
      const project = await Project.findById(payment.projectId);
      if (project) {
        project.budget.depositPaid += payment.amount;
        await project.save();
      }
    }
    
    res.json({
      success: true,
      message: 'Payment captured successfully',
      data: {
        transactionId: capture.result.purchase_units[0].payments.captures[0].id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error capturing payment',
      error: error.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('projectId', 'projectName client')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// @desc    Get payments by project
// @route   GET /api/payments/project/:projectId
// @access  Private
exports.getPaymentsByProject = async (req, res) => {
  try {
    const payments = await Payment.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// @desc    Create manual payment (bank transfer, check, etc.)
// @route   POST /api/payments/manual
// @access  Private
exports.createManualPayment = async (req, res) => {
  try {
    const { projectId, amount, paymentMethod, description, transactionId, customerInfo } = req.body;
    
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Create payment record
    const payment = await Payment.create({
      projectId,
      amount,
      paymentMethod,
      status: 'completed',
      transactionId,
      customerInfo,
      description,
      paidAt: new Date()
    });
    
    // Update project deposit
    project.budget.depositPaid += amount;
    await project.save();
    
    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
};

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private
exports.getPaymentStats = async (req, res) => {
  try {
    const stats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { 
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics',
      error: error.message
    });
  }
};
