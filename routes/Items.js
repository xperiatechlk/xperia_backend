const express = require('express'); 
const multer = require('multer');
const router = express.Router();
const itemController = require('../controller/Items'); // Adjust the path if needed

const upload = multer({ dest: 'uploads/' });

// Get all items
router.get('/', itemController.getItems);

// Get a single item by ID
router.get('/:id', itemController.getItemById);

// Create a new item
router.post('/', itemController.addItem);

// Update an existing item by ID
router.put('/:id', itemController.updateItem);

// Delete an item by ID
router.delete('/:id', itemController.deleteItem);

// Route for bulk upload of items via Excel
router.post('/bulk', upload.single('file'), itemController.bulkAddItems);

module.exports = router;
