const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    boy: { type: mongoose.Schema.Types.ObjectId, ref: "boy" },
    fname: String,
    isAdmin: Boolean,
});

userSchema.plugin(passportLocalMongoose, {
    populateFields: "boy",
    usernameUnique: false,
});

module.exports = mongoose.model("user", userSchema);
