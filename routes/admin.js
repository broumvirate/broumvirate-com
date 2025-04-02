var express = require("express");
var router = express.Router();
var bmHelpers = require("../bmHelpers");

const Boy = require("../models/boy"),
    User = require("../models/user");

// ADMIN INDEX
router.get("/admin", bmHelpers.isAdmin, function (req, res) {
    Boy.find({})
        .then(Boys => {
            return User.find({})
                .populate("boy")
                .then(Users => {
                    res.render("admin/admin", {
                        pageName: "Admin Panel",
                        Boys: Boys,
                        Users: Users,
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        });
});

// BOY Create

// BOY Edit

// BOY Put

// BOY Delete
router.delete("/admin/boy/:id", bmHelpers.isAdmin, function (req, res) {
    Boy.find({ id: req.params.id })
        .then(delBoy => {
            if (delBoy.flags && delBoy.flags.registered) {
                return User.deleteOne({ boy: req.params.id })
                    .then(() => Boy.deleteOne({ _id: req.params.id }));
            } else {
                return Boy.deleteOne({ _id: req.params.id });
            }
        })
        .then(() => {
            res.redirect("/admin");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/admin");
        });
});

// USER Edit

// USER Put

// USER Delete
router.delete("/admin/user/:id", bmHelpers.isAdmin, function (req, res) {
    User.find({ _id: req.params.id })
        .then(theUser => {
            return Boy.findByIdAndUpdate(theUser.boy, {
                flags: { registered: false },
            }, { new: true })
            .then(() => User.deleteOne({ _id: req.params.id }));
        })
        .then(() => {
            res.redirect("/admin");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/admin");
        });
});

module.exports = router;
