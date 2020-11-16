const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    boy: { type: mongoose.Schema.Types.ObjectId, ref: "boy" },
    fname: String,
    isAdmin: Boolean,
});

userSchema.plugin(passportLocalMongoose, { populateFields: "boy" });

module.exports = mongoose.model("user", userSchema);
