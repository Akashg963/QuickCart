import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    items: [{
        productId: {
            type: String,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;