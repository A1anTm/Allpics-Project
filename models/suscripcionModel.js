import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    plan: {
        type: String,
        enum: ['free', 'premium', 'enterprise'],
        required: true,
    },
    price: {
        type: Number,
        required: true, 
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: null, 
    },
    isActive: {
        type: Boolean,
        default: true, 
    }
});


subscriptionSchema.pre('save', function(next) {
    if (this.endDate && this.endDate < Date.now()) {
        this.isActive = false; 
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;