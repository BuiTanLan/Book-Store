const mongoose = require("mongoose");
const Comment = require("./comment");
const Author = require("./author")
const Category = require("./category");
const { Schema } = mongoose;
var mongoosePaginate = require('mongoose-paginate-v2');

const BookSchema = new Schema({
  // id: {
  //   type: String,
  //   required: true,
  // },
  id: String,
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: String,
  views: {
    type: Number,
    default: 0,
  },
  quantity_sold: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: Author,
  },
  price: {
    type: Number,
    default: 0,
  },
  publisher: String,
  description: String,
  comments: [
    {
      name: String,
      content: String,
      date: {
        type: Date,
        default: Date.now
      },
      show: {
        type: Boolean,
        default: true,
      },
    },
  ],
  category: [
    {
      type: mongoose.Types.ObjectId,
      ref: Category,
    },
  ],
  image: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: true,
  },
});

BookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Book", BookSchema);
