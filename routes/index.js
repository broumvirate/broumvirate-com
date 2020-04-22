var express = require("express");
var router = express.Router()
var bmHelpers = require("../bmHelpers")

const   Boy = require("../models/boy"),
        Nick = require("../models/nick")

// INDEX - Homepage
router.get("/", function(req, res){
	res.render("home", {pageName:"Home", });
})

// Contact page
router.get("/contact", function(req, res){
	res.render("contact", {pageName:"Contact", });
})

// Music page
router.get("/music", function(req, res){
	res.render("music", {pageName:"Music", });
})

// Games page
router.get("/games", function(req, res){
	res.render("games", {pageName:"Games", });
})

// Fuck me in the house page
router.get("/fuckmeinthehouse", function(req, res){
	res.render("fuckmeinthehouse", {pageName:"Fuck Me In The House", });
})

// Nickname page
router.get("/nicknames", function(req, res){
	Nick.find({}).sort({"date":1}).populate("nicknames.boy").exec(function(err, nicks){
		if(err){
			console.log(err);
		}
		else{
			res.render("nick", {pageName:"Nicknames", nicknames:nicks})
		}
	})
})

module.exports = router;