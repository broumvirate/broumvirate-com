import express from "express";
import bmHelpers from "../bmHelpers.js";
import Nick from "../models/nick.js";
import quotes from "./quotes.js";
import music from "./music.js";

const router = express.Router();

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
router.get("/nicknames", bmHelpers.isLoggedIn, function (req, res, next) {
    Nick.find()
        .sort({ date: 1 })
        .populate("nicknames.boy")
        .then((nicks) => {
            res.render("nick", { pageName: "Nicknames", nicknames: nicks });
        })
        .catch((err) => {
            console.error(err);
            next(); // Pass the error to the next middleware
        });
});

export default router;
