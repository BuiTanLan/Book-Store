const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  userId: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Comment", CommentSchema);
