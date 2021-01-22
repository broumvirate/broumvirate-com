const mongoose = require("mongoose");

const bhothmMemeSchema = new mongoose.Schema({
    name: String,
    urlPrefix: String,
    urlSuffix: String,
    textCount: Number,
    lines: Number,
});

const bhothmMeme = mongoose.model("bhothmMeme", bhothmMemeSchema);

const bhothmTextSchema = new mongoose.Schema({
    text: String,
});

const bhothmText = mongoose.model("bhothmText", bhothmTextSchema);

module.exports = {
    bhothmMeme,
    bhothmText,
};
