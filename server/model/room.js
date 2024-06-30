const { Schema, model } = require("mongoose")
const roomSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "USER"
    },
    text: {
        type: String,
        default: ""
    },
    content: {
        type: [
            {
                tool: String,
                strokeWidth: Number,
                color: String,
                points: [Number],
            },
        ],
        default: [],
    },
}, {
    timestamps: true
})

roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Room = model("room", roomSchema);

module.exports = Room