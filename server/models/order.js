import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceType:{
        type: String,
        required: true
    },
    file: [{
        originalName: String,
        public_id: String,
        resourceType: String,
        version: Number,
        url: String,
        mimeType: String,
        size: Number
    }],
    instructions: {
        type: String,
        default: ''
    },
    copies: {
        type: Number,
        default: 1,
        required: true
    },
    fileCount: {
        type: Number,
        default: 1
    },
    totalPages: {
        type: Number,
        default: 0
    },
    billingUnits: {
        type: Number,
        default: 0
    },
    unitPrice: {
        type: Number,
        default: 0
    },
    pricingUnit: {
        type: String,
        enum: ['per page', 'per set', 'fixed'],
        default: 'fixed'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in-progress', 'completed', 'rejected'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    priceFinalized: {
        type: Boolean,
        default: false
    },
    priceFinalizedAt: {
        type: Date,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
},{
    timestamps: true
});

const Order = mongoose.model('Orders', orderSchema);

export default Order;
