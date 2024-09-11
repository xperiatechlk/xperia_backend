const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    itemName: {
        type: String,
        required: true,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,  // Minimum quantity is 1
    },
    paymentType: {
        type: String,
        required: true,
        enum: ['Cash', 'Card', 'Bank'],  // Only allow these three options
    },
    bankName: {
        type: String,
        trim: true,
        required: function() {
            return this.paymentType === 'Bank';
        },
    },
    trackingID: {
        type: String,
        trim: true,
        required: function() {
            // Assuming trackingID is required if item is shipped
            return this.isShipped === true;
        },
    },
    isShipped: {
        type: Boolean,
        default: false,  // Set the default shipping status to false
    }
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = { Sales };
