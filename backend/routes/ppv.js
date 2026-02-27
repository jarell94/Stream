const express = require('express');
const router = express.Router();
const ppvController = require('../controllers/ppvController');
const { protect } = require('../middleware/auth');

router.get('/purchases', protect, ppvController.getPPVPurchases);
router.get('/:videoId/access', protect, ppvController.checkPPVAccess);
router.post('/:videoId/purchase', protect, ppvController.purchasePPV);

module.exports = router;
