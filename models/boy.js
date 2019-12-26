var mongoose = require("mongoose")

var boySchema = new mongoose.Schema({
	name: String,
	lastName: String,
	bid: Number,
	active: Boolean,
	registered: Boolean
});

module.exports = mongoose.model("boy", boySchema);