var express = require("express");
var router = express.Router();
var bmHelpers = require("../bmHelpers");

const Boy = require("../models/boy"),
    Nick = require("../models/nick");

const quotes = require("./quotes");
const music = require("./music")

// INDEX - Homepage
router.get("/", function (req, res) {
    res.render("home", { pageName: "Home", quotes });
});

// Contact page
router.get("/contact", function (req, res) {
    res.render("contact", { pageName: "Contact" });
});

// Music page
router.get("/music", function (req, res) {
    res.render("music", { pageName: "Music", music });
});

// Nickname page
router.get("/nicknames", bmHelpers.isLoggedIn, function (req, res) {
    Nick.find()
        .sort({ date: 1 })
        .populate("nicknames.boy")
        .exec((err, nicks) => {
            if (err) {
                next();
            } else {
                res.render("nick", { pageName: "Nicknames", nicknames: nicks });
            }
        });
});

module.exports = router;
