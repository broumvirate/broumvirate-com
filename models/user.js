var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	boy:{type: mongoose.Schema.Types.ObjectId, ref: "boy"},
	fname: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);