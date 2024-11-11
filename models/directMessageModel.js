import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    content: {
        type: String,
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    read: {
        type: Boolean,
        default: false, 
    }
});

// Middleware para actualizar la fecha de creación antes de guardar
directMessageSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); // Actualiza la fecha de actualización
    next();
});

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);

export default DirectMessage;