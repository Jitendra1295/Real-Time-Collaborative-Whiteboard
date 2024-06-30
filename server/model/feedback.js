const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    feedbackText: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Feedback = model('Feedback', feedbackSchema);

module.exports = Feedback;
