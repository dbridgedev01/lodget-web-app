const mongoose = require("mongoose");

const lodgeSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
});

module.exports = mongoose.model("Lodge", lodgeSchema);