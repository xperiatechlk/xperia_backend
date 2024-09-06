const { Item } = require("../model/Item");

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
}

module.exports = new ItemController();
