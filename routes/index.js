var express = require("express");
var router = express.Router();
var bmHelpers = require("../bmHelpers");

const Boy = require("../models/boy"),
    Nick = require("../models/nick");

// INDEX - Homepage
router.get("/", function (req, res) {
    res.render("home", { pageName: "Home" });
});

// Contact page
router.get("/contact", function (req, res) {
    res.render("contact", { pageName: "Contact" });
});

// Music page
router.get("/music", function (req, res) {
    res.render("music", { pageName: "Music" });
});

// Nickname page
router.get("/nicknames", bmHelpers.isLoggedIn, function (req, res) {
    Nick.find()
        .sort({ date: 1 })
        .populate("nicknames.boy")
        .exec()
        .then((nicks) => {
            res.render("nick", { pageName: "Nicknames", nicknames: nicks });
        })
        .catch((err) => console.log(err));
});

module.exports = router;
