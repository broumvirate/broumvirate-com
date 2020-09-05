var express = require("express");
var router = express.Router();
var bmHelpers = require("../bmHelpers");

const Boy = require("../models/boy"),
    User = require("../models/user");

// On Promises: This section is WIP, so has not been promisifed

// ADMIN INDEX
router.get("/admin", bmHelpers.isAdmin, function (req, res) {
    Boy.find({}, function (err, Boys) {
        if (err) {
            console.log(err);
        } else {
            User.find({})
                .populate("boy")
                .exec(function (err, Users) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("admin/admin", {
                            pageName: "Admin Panel",
                            Boys: Boys,
                            Users: Users,
                        });
                    }
                });
        }
    });
});

// BOY Create

// BOY Edit

// BOY Put

// BOY Delete
router.delete("/admin/boy/:id", bmHelpers.isAdmin, function (req, res) {
    Boy.find({ id: req.params.id }, function (err, delBoy) {
        if (err) {
            console.log(err);
        } else {
            if (delBoy.flags.registered) {
                User.deleteOne({ boy: req.params.id }); // If user with boy, delete the user too
            }

            Boy.deleteOne({ _id: req.params.id }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/admin");
                }
            });
        }
    });
});

// USER Edit

// USER Put

// USER Delete
router.delete("/admin/user/:id", bmHelpers.isAdmin, function (req, res) {
    User.find({ _id: req.params.id }, function (err, theUser) {
        if (err) {
            console.log(err);
        } else {
            Boy.findByIdAndUpdate(theUser.boy, {
                flags: { registered: false },
            });
            User.deleteOne({ _id: req.params.id }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/admin"); //Make this do some fuckin ajax shit
                }
            });
        }
    });
});

module.exports = router;
