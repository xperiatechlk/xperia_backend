const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String, 
        trim: true,
    },
    category: {
        type: String, 
        trim: true,
    },
    quantity: {
        type: Number, 
        min: 0,
    },
    unitPrice: {
        type: Number, 
        min: 0,
    },
    sellingPrice: {
        type: Number, 
        min: 0,
    },
    description: {
        type: String,
        trim: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = { Item };
