import mongoose from "mongoose";

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

export default mongoose.model("Rating", ratingSchema);