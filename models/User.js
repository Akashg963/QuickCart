import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
    type: String,
    default: ""
    },
    imageUrl: {
        type: String,
        required: true
    },
    cartItems: {
        type: Object,
        of: Number,
        default: {}
    }
}, {minimize: false});

const User = mongoose.models.User || mongoose.model.User ("User", userSchema);

export default User;