var express = require("express");
var router = express.Router()
var bmHelpers = require("../bmHelpers")

// Games page
router.get("/games", function(req, res){
	res.render("games", {pageName:"Games", });
})

// Rock game
router.get("/games/rockgame", function(req, res){
	res.render("../public/game/rockgame/index", {pageName:"", });
})

module.exports = router;