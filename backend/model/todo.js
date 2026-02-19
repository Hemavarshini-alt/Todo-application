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
});
//model
module.exports = mongoose.model("Todo", TodoSchema);
