const express = require('express');
const router = express.Router();
const { createOrder, cancelOrder, getOrder, getAllOrder } = require('../controllers/orderController')

router.post('/create', createOrder)
router.get('/', getAllOrder)
router.get('/:id', getOrder)
router.put('/cancel/:id', cancelOrder)

module.exports = router;