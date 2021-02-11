const express = require("express");
const router = express.Router();
const passport = require("passport");
const bmHelpers = require("../bmHelpers");
const util = require("util");

const Boy = require("../models/boy"),
    User = require("../models/user");

const RegisterUser = util.promisify(User.register);

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
router.post("/register", bmHelpers.cleanBody, async function (req, res) {

    const captcha = req.body["h-captcha-response"];
    const captchaResponse = await bmHelpers.verifyCaptcha(captcha);
    if(captchaResponse.success)
    {
        try{
            const boyRes = await Boy.findById(req.body.boy);
            if(!boyRes.flags.isUser || boyRes.flags.registered) throw new Error("Cannot register account.");

            const user = User.register(
                new User({username: req.body.username, boy:boyRes}),
                req.body.password, 
                (err, user) => {
                    if(err) {
                        console.log(err);
                        res.redirect("/register");
                    }
                    else{

                        boyRes.flags.registered = true;
                        boyRes.email = req.body.username;
                        boyRes.user = user._id;
                        boyRes.save();
            
                        passport.authenticate("local")(req, res, function () {
                            res.redirect("/");
                        });
                    }
                });
        }
        catch(err) {
                console.log(err);
                res.redirect("/register");
        }
    }
    else{
        console.log("Could not verify captcha");
        res.redirect("/register");
    }
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
