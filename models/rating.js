const mongoose = require("mongoose")

let ratingSchema = new mongoose.Schema({
	name: String,
	category: String,
	description: String,
	link: String,
	rates: [
		{
			boy:{type: mongoose.Schema.Types.ObjectId,
				ref: "Boy"},
			value1: Number
		}
	]
})

module.exports = mongoose.model("Rating", ratingSchema);