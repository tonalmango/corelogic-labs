const express = require('express');
const router = express.Router();
const {
  createPayPalOrder,
  capturePayPalPayment,
  getAllPayments,
  getPaymentsByProject,
  createManualPayment,
  getPaymentStats
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.use(protect);

router.get('/stats', getPaymentStats);
router.get('/', getAllPayments);
router.get('/project/:projectId', getPaymentsByProject);
router.post('/create-order', createPayPalOrder);
router.post('/capture', capturePayPalPayment);
router.post('/manual', createManualPayment);

module.exports = router;
