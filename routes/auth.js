var express = require("express");
var router = express.Router();
var passport = require("passport");
var bmHelpers = require("../bmHelpers");

var Boy = require("../models/boy"),
    User = require("../models/user");

// REGISTER INDEX
router.get("/register", function (req, res) {
    Boy.find({ "flags.registered": false, "flags.isUser": true })
        .sort("bid")
        .exec()
        .then((boys) => {
            res.render("register", {
                boys: boys,
                pageName: "Register",
                currentUser: req.user,
            });
        })
        .catch((err) => console.log(err));
});

// REGISTER POST
router.post("/register", bmHelpers.cleanBody, function (req, res) {
    Boy.findByIdAndUpdate(req.body.boy, {
        "flags.registered": true,
        email: req.body.username,
    })
        .exec()
        .then((result) => {
            User.register(
                new User({ username: req.body.username, boy: result }),
                req.body.password,
                function (err, user) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/register");
                    }
                    passport.authenticate("local")(req, res, function () {
                        res.redirect("/");
                    });
                }
            );
        })
        .catch((err) => console.log(err));
});

// LOGIN INDEX
router.get("/login", function (req, res) {
    let redirectUrl = req.query.redirect;
    res.render("login", { pageName: "Log In", redirect: redirectUrl });
});

// LOGIN POST
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
    }),
    function (req, res) {
        res.redirect(req.body.redirect);
    }
);

// LOGOUT
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

// API AUTH
router.get("/api/user/authenticated", function (req, res) {
    let result = {
        isLoggedIn: false,
        isAdmin: false,
    };

    if (req.isAuthenticated()) {
        result.isLoggedIn = true;
        result.boy = req.user.boy;
        if (req.user.isAdmin) {
            result.isAdmin = true;
        }
    }
    res.json(result);
});

// API BOYS
router.get("/api/boys", function (req, res) {
    Boy.find()
        .then((data) => res.json(data))
        .catch((err) =>
            next([{ code: 500, title: "Unable to get boys", details: err }])
        );
});

router.get("/api/alden", function (req, res) {
    res.json({ alden: "Alden!" });
});

module.exports = router;
