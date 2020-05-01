const mongoose = require("mongoose")

let boySchema = new mongoose.Schema({
	name: String,
	lastName: String,
	email: String,
	bid: Number,
	active: Boolean,         //DELETE ME
	registered: Boolean,     //DELETE ME
	nickOrder: Number,       //order in which you're shown on nickname page
	flags:{
		active: Boolean,     //is active - ie. able to have a user account
		coreBM: Boolean,     //is core broumvirate member
		registered: Boolean, //is member registered
		canRate: Boolean,    //allowed to have rating data entered
		hasNicks: Boolean,   //nicknames are shown on nickname table
		likesFrog: Boolean,  //does this man like frog?
	}
});

module.exports = mongoose.model("boy", boySchema);