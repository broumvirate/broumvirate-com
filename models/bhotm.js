const mongoose = require("mongoose")
const dayjs = require("dayjs");

let bhotmSchema = new mongoose.Schema({
    month: String,
    date: Date,
    entries:[{
        name: String,
        email: String,
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
    // entries:[{type: mongoose.Schema.Types.ObjectId,
    //     ref: "entry"}],
    notes: String,
    winner: String
})

const bhotm = mongoose.model("bhotm", bhotmSchema, "bhotms");

let entrySchema = new mongoose.Schema({
    date: Date,
    name: String,
    email: String,
    entryName: String,
    entryDescription: String,
    boy: {type: mongoose.Schema.Types.ObjectId, ref:"boy"},
    link: String,
    clickLink: String,
    format: String,
    place: Number,
    isWinner: Boolean
})

const bhotmEntry = mongoose.model("bhotmEntry", entrySchema, "bhotmentries");

module.exports = {
    bhotm: bhotm,
    bhotmEntry: bhotmEntry
};