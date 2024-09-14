const { Item } = require("../model/Item");
const XLSX = require('xlsx');

class ItemController {
    // Add Item
    async addItem(req, res) {
        try {
            // Create a new Item object
            const item = new Item({
                itemName: req.body.itemName,
                category: req.body.category,
                quantity: req.body.quantity,
                unitPrice: req.body.unitPrice,
                sellingPrice: req.body.sellingPrice,
                description: req.body.description,
            });

            // Save the item object
            await item.save();
            res.status(201).json({ success: true, message: 'Item added successfully' });
        } catch (err) {
            // Handle validation or other errors
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // Retrieve all Items
    async getItems(req, res) {
        try {
            const items = await Item.find();
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Retrieve a single Item by ID
    async getItemById(req, res) {
        const { id } = req.params;
        try {
            const item = await Item.findById(id);
            if (!item) return res.status(404).json({ message: 'Item not found' });

            res.json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Update Item
    async updateItem(req, res) {
        const { id } = req.params;

        try {
            let item = await Item.findById(id);
            if (!item) return res.status(404).json({ message: 'Item not found' });

            // Update item details
            Object.assign(item, req.body);
            await item.save();
            res.json({ success: true, message: 'Item updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Delete Item
    async deleteItem(req, res) {
        const { id } = req.params;

        try {
            const item = await Item.findByIdAndDelete(id);
            if (!item) return res.status(404).json({ message: 'Item not found' });

            res.json({ success: true, message: 'Item deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Bulk Add Items from Excel File
    async bulkAddItems(req, res) {
        try {
            const filePath = req.file.path;

            // Read the Excel file
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Map Excel data to Item model schema
            const items = worksheet.map(row => ({
                itemName: row['name'],
                category: row['category'],
                quantity: row['quentity'], // Handle typo in the Excel file field
                unitPrice: row['unit price'],
                sellingPrice: row['selling price'],
                description: row['description'] || '',
            }));

            // Bulk insert the items using Mongoose
            const result = await Item.insertMany(items);

            // Send success response
            res.status(201).json({
                success: true,
                message: 'Items added successfully',
                insertedCount: result.length,
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = new ItemController();
