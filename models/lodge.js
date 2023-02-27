const mongoose = require("mongoose");

const lodgeSchema = new mongoose.Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model("Lodge", lodgeSchema);