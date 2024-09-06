const express = require('express');
const router = express.Router();
const repairController = require('../controller/Repair'); // Adjust the path if needed

// Get all repairs
router.get('/', repairController.getRepairs);

// Get a single repair by ID
router.get('/:id', repairController.getRepairById);

// Create a new repair
router.post('/', repairController.addRepair);

// Update an existing repair by ID
router.put('/:id', repairController.updateRepair);

// Delete a repair by ID
router.delete('/:id', repairController.deleteRepair);
 

module.exports = router;
