const mongoose = require("mongoose")

let bhotmSchema = new mongoose.Schema({
    month: String,
    date: Date,
    entries:[{
        name: String,
        entryName: String,
        entryDescription: String,
        boy: {type: mongoose.Schema.Types.ObjectId,
            ref: "boy"},
        bid: String,
        isWinner: Boolean,
        place: Number,
        link: String,
        clickLink: String,
        format: String
    }],
    notes: String,
    winner: String
})

module.exports = mongoose.model("bhotm", bhotmSchema);