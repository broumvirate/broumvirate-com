var mongoose = require("mongoose")

var categorySchema = new mongoose.Schema({
	name: String,
	category: String,
	tokens: String
});

module.exports = mongoose.model("category", categorySchema);