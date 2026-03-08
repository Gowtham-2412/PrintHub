import mongoose, { Mongoose, Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['costumer', 'owner'],
        default: 'costumer'
    },
    phone: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User;