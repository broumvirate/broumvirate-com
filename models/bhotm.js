const mongoose = require("mongoose");
const dayjs = require("dayjs");

let bhotmSchema = new mongoose.Schema({
    month: String,
    date: Date,
    // entries: [
    //     {
    //         name: String,
    //         email: String,
    //         entryName: String,
    //         entryDescription: String,
    //         boy: { type: mongoose.Schema.Types.ObjectId, ref: "boy" },
    //         bid: String,
    //         isWinner: Boolean,
    //         place: Number,
    //         link: String,
    //         clickLink: String,
    //         format: String,
    //     },
    // ],
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "BhotmEntry" }],
    notes: String,
    winner: String,
    winnerRef: { type: mongoose.Schema.Types.ObjectId, ref: "BhotmEntry" },
    judge: String,
    hasBeenJudged: { type: Boolean, default: false },
    isBhoty: { type: Boolean, default: false },
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

const bhotm = mongoose.model("Bhotm", bhotmSchema, "bhotms");

let entrySchema = new mongoose.Schema({
    entryDate: Date,
    name: String,
    email: String,
    entryName: String,
    entryDescription: String,
    boy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Boy" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    month: { type: mongoose.Schema.Types.ObjectId, ref: "Bhotm" },
    link: String,
    clickLink: String,
    format: String,
    place: { type: Number, default: -1 },
    bhotyPlace: { type: Number, default: -1 },
    isWinner: { type: Boolean, default: false },
    hasBeenJudged: { type: Boolean, default: false },
    entryMethod: String,
    edited: { type: Boolean, default: false },
    lastEditedDate: Date,
    isDeleted: { type: Boolean, default: false },
    requiresLogin: { type: Boolean, default: false },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const bhotmEntry = mongoose.model("BhotmEntry", entrySchema, "bhotmentries");

module.exports = {
    bhotm: bhotm,
    bhotmEntry: bhotmEntry,
};
