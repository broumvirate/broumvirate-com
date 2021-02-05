const mongoose = require("mongoose");

const bhothmMemeSchema = new mongoose.Schema({
    name: String,
    urlPrefix: String,
    urlSuffix: String,
    textCount: Number,
    lines: Number,
    templates: [{  type: String  }],
    repeatLast: { type: Boolean, default: false },
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
