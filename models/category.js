const mongoose = require("mongoose")

let categorySchema = new mongoose.Schema({
	name: String,
	category: String,
	tokens: String
});

module.exports = mongoose.model("Category", categorySchema);