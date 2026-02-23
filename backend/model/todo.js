const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    userTask: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("todo", TodoSchema);