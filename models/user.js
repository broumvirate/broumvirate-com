const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
	username: String,
	password: String,
	boy:{type: mongoose.Schema.Types.ObjectId, ref: "boy"},
	fname: String,
	isAdmin: Boolean
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);