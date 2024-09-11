const { Sales } = require('../model/Selles');
const { Item } = require('../model/Item');

// Add Sale
const addSale = async (req, res) => {
    try {
        const { itemName, quantity } = req.body;
        
        // Find the item to check quantity
        const item = await Item.findOne({ itemName });
        if (!item || item.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient item quantity or item not found' });
        }

        // Create sale
        const sale = new Sales(req.body);
        await sale.save();

        // Update item quantity
        item.quantity -= quantity;
        await item.save();

        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Error adding sale', error });
    }
};

// Edit Sale
const editSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemName, quantity } = req.body;

        // Find the sale and the related item
        const sale = await Sales.findById(id);
        const item = await Item.findOne({ itemName });

        if (!sale || !item) {
            return res.status(404).json({ message: 'Sale or item not found' });
        }

        // Adjust item quantity (revert old sale and apply new sale quantity)
        item.quantity += sale.quantity - quantity;
        if (item.quantity < 0) {
            return res.status(400).json({ message: 'Insufficient item quantity' });
        }

        // Update sale
        Object.assign(sale, req.body);
        await sale.save();
        await item.save();

        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Error updating sale', error });
    }
};

// Delete Sale
const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the sale and related item
        const sale = await Sales.findById(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        const item = await Item.findOne({ itemName: sale.itemName });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Restore item quantity when sale is deleted
        item.quantity += sale.quantity;
        await item.save();

        await sale.remove();
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sale', error });
    }
};

// Get Sales List
const getSalesList = async (req, res) => {
    try {
        const sales = await Sales.find();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales list', error });
    }
};

// Get Sale by ID
const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sales.findById(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sale', error });
    }
};

// Get Sales Count by Date Range
const getSalesCountByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const count = await Sales.countDocuments({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales count', error });
    }
};

module.exports = {
    addSale,
    editSale,
    deleteSale,
    getSalesList,
    getSaleById,
    getSalesCountByDateRange,
};
