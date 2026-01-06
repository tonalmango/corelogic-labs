const Quote = require('../models/Quote');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.submitQuote = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { name, agencyName, email, phone, services, budget, details } = req.body;

        const quote = await Quote.create({
            name,
            agencyName,
            email,
            phone,
            services,
            budget,
            details,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        await transporter.sendMail({
            from: `"CoreLogic Labs" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Your Quote Request Received',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6366f1;">Thank You for Your Quote Request</h2>
                    <p>Hello ${name},</p>
                    <p>We've received your quote request for the following services:</p>
                    <ul>
                        ${services.map(service => `<li>${service}</li>`).join('')}
                    </ul>
                    <p><strong>Budget Range:</strong> ${budget}</p>
                    <p>Our team will review your request and get back to you within 24 hours with a custom quote.</p>
                    <p>Best regards,<br>The CoreLogic Labs Team</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </div>
            `
        });

        await transporter.sendMail({
            from: `"CoreLogic Labs" <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_USER,
            subject: 'New Quote Request Submitted',
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>New Quote Request</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Agency:</strong> ${agencyName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Services:</strong> ${services.join(', ')}</p>
                    <p><strong>Budget:</strong> ${budget}</p>
                    <p><strong>Details:</strong><br>${details || 'No additional details'}</p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                </div>
            `
        });

        res.status(201).json({
            status: 'success',
            message: 'Quote request submitted successfully',
            data: {
                quote: {
                    id: quote._id,
                    name: quote.name,
                    agencyName: quote.agencyName,
                    email: quote.email,
                    services: quote.formattedServices,
                    budget: quote.budget,
                    status: quote.status,
                    createdAt: quote.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllQuotes = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, sort = '-createdAt' } = req.query;
        
        const query = {};
        if (status) query.status = status;
        
        const quotes = await Quote.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');
        
        const total = await Quote.countDocuments(query);
        
        res.status(200).json({
            status: 'success',
            data: {
                quotes,
                pagination: {
                    currentPage: page * 1,
                    totalPages: Math.ceil(total / limit),
                    totalQuotes: total,
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getQuote = async (req, res, next) => {
    try {
        const quote = await Quote.findById(req.params.id);
        
        if (!quote) {
            return res.status(404).json({
                status: 'error',
                message: 'Quote not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: { quote }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateQuote = async (req, res, next) => {
    try {
        const { status, quoteAmount, notes } = req.body;
        
        const quote = await Quote.findByIdAndUpdate(
            req.params.id,
            { status, quoteAmount, notes, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!quote) {
            return res.status(404).json({
                status: 'error',
                message: 'Quote not found'
            });
        }
        
        if (status === 'quoted' && quoteAmount) {
            await transporter.sendMail({
                from: `"CoreLogic Labs" <${process.env.EMAIL_FROM}>`,
                to: quote.email,
                subject: 'Your Custom Quote is Ready',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #6366f1;">Your Custom Quote is Ready</h2>
                        <p>Hello ${quote.name},</p>
                        <p>We've prepared a custom quote for your requested services:</p>
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3>Quote Details</h3>
                            <p><strong>Quote Amount:</strong> $${quoteAmount.toLocaleString()}</p>
                            <p><strong>Services Included:</strong> ${quote.formattedServices.join(', ')}</p>
                            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                        </div>
                        <p>Please reply to this email to proceed with the next steps.</p>
                        <p>Best regards,<br>The CoreLogic Labs Team</p>
                    </div>
                `
            });
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Quote updated successfully',
            data: { quote }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteQuote = async (req, res, next) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        
        if (!quote) {
            return res.status(404).json({
                status: 'error',
                message: 'Quote not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Quote deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.getQuoteStats = async (req, res, next) => {
    try {
        const stats = await Quote.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$quoteAmount' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalQuotes: { $sum: '$count' },
                    statusCounts: { $push: { status: '$_id', count: '$count' } },
                    totalQuoteAmount: { $sum: '$totalAmount' }
                }
            }
        ]);
        
        const serviceStats = await Quote.aggregate([
            { $unwind: '$services' },
            {
                $group: {
                    _id: '$services',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        
        const monthlyStats = await Quote.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 }
        ]);
        
        res.status(200).json({
            status: 'success',
            data: {
                summary: stats[0] || { totalQuotes: 0, statusCounts: [], totalQuoteAmount: 0 },
                serviceStats,
                monthlyStats
            }
        });
    } catch (error) {
        next(error);
    }
};