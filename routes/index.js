var express = require("express");
var router = express.Router()

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

module.exports = router;