import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: ''
    },
    price:{
        type: Number,
        required: true
    },
    unit:{
        type: String,
        default: 'per page',
        enum: ['per page', 'per set', 'fixed']
    },
    icon:{
        type: String,
        default: 'file'
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

const Service = mongoose.model('Service', serviceSchema);

export default Service;