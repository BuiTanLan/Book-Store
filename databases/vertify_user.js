const mongoose = require("mongoose");
const { Schema } = mongoose;

const VertifySchema = new Schema({
    id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    full_name: String,
    address: String,
    phone_number: String,
    salt: String,
});

module.exports = mongoose.model("Vertify", VertifySchema);
