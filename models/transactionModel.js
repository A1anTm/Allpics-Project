import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
    },
    amount: {
        type: Number,
        required: true, 
    },
    currency: {
        type: String,
        required: true, 
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'], 
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['PayPal'],
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    }
});


const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;