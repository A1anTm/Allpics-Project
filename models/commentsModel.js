import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publication',
        required: true,
    },
    author: {
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
    updatedAt: {
        type: Date,
        default: Date.now, 
    }
});


commentSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); 
    next();
});

const Comments = mongoose.model('Comments', commentSchema);

export default Comments;