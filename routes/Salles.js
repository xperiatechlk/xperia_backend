const express = require('express');
const router = express.Router();
const salesController = require('../controller/Salles');

// Add a new sale
router.post('/', salesController.addSale);

// Get all sales
router.get('/', salesController.getSalesList);

// Get a single sale by ID
router.get('/:id', salesController.getSaleById);

// Update a sale
router.put('/:id', salesController.editSale);

// Delete a sale
router.delete('/:id', salesController.deleteSale);

// Get sales count within a date range (e.g., ?startDate=2024-01-01&endDate=2024-12-31)
router.get('/count/date-range', salesController.getSalesCountByDateRange);

module.exports = router;
