const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    boy: { type: mongoose.Schema.Types.ObjectId, ref: "Boy" },
    fname: String,
    isAdmin: Boolean,
});

userSchema.plugin(passportLocalMongoose, {
    populateFields: "boy",
});

module.exports = mongoose.model("User", userSchema);
