const mongoose = require("mongoose");

let boySchema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: String,
    bid: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    active: Boolean, //DELETE ME
    registered: Boolean, //DELETE ME
    nickOrder: Number, //order in which you're shown on nickname page
    discordTag: String,
    flags: {
        isUser: Boolean, //is a user - ie. able to have a user account
        coreBm: Boolean, //is core broumvirate member
        registered: Boolean, //is member registered
        canRate: Boolean, //allowed to have rating data entered
        hasNicks: Boolean, //nicknames are shown on nickname table
        likesFrog: Boolean, //does this man like frog?
        isAdmin: Boolean,
    },
});

module.exports = mongoose.model("boy", boySchema);
