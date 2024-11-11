import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    media: [{
        type: String,
        default: [],
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: [],
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

postSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); // Actualiza la fecha de actualización
    next();
});


const Publication = mongoose.model('Publication', postSchema);

export default Publication;