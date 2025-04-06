import express from "express";

const router = express.Router();

// Games page
router.get("/games", function(req, res){
    res.render("games", {pageName:"Games", });
})

// Rock game
router.get("/games/rock-game", function(req, res){
    res.render("../public/games/rock-game/index", {pageName:"Rock Game", });
})

export default router;