const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    deviceType: {
        type: String,
        required: true,
        trim: true,
    },
    fault: {
        type: String,
        required: true,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Done', 'Delivered'],
        required: true,
    }
});

const Repair = mongoose.model('Repair', repairSchema);

module.exports = { Repair };
