var mongoose = require("mongoose")

var ratingSchema = new mongoose.Schema({
	name: String,
	category: String,
	description: String,
	rates: [
		{
			boy:{type: mongoose.Schema.Types.ObjectId,
				ref: "boy"},
			value1: Number
		}
	]
})

module.exports = mongoose.model("rating", ratingSchema);