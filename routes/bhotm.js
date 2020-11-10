var express = require("express");
var router = express.Router();
var bmHelpers = require("../bmHelpers");

const Boy = require("../models/boy"),
    User = require("../models/user"),
    { bhotm } = require("../models/bhotm"),
    { bhotmEntry } = require("../models/bhotm");

// ON PROMISES:
// This module has not been promisifed, as it is in the midst of being re-written in the bhotmAPI branch

// INDEX - BHoTM Standard Viewing Page
router.get("/bhotmold", function (req, res) {
    bhotm
        .find({})
        .sort({ date: -1, "entries.place": 1 })
        .populate("submissions")
        .exec(function (err, bhotm) {
            if (err) {
                console.log(err);
            } else {
                res.render("bhotm/index", {
                    pageName: "Ben Hagle of the Month",
                    bhotm: bhotm,
                });
            }
        });
});

// ADMIN INDEX - Admin page, available only to admins like Ben Hagle
router.get("/bhotmold/admin", bmHelpers.isAdmin, function (req, res) {
    bhotm
        .find({})
        .sort("-date")
        .populate("entries.boy")
        .exec(function (err, bhotm) {
            if (err) {
                console.log(err);
            } else {
                res.render("bhotm/admin", {
                    pageName: "BHotM Admin",
                    bhotm: bhotm,
                });
            }
        });
});

// NEW
router.get("/bhotmold/new", bmHelpers.isAdmin, function (req, res) {
    Boy.find({}, function (err, boys) {
        if (err) {
            console.log(err);
        } else {
            res.render("bhotm/new", {
                pageName: "New BHotM",
                entries: req.query.entries,
                boys: boys,
            });
        }
    });
});

// CREATE -- Add new BHotM from creation page
router.post("/bhotmold", bmHelpers.isAdmin, function (req, res) {
    var thisMonth = bmHelpers.bhotm.processMonth(req.body.bhotm);
    var d = new Date();
    thisMonth.date = d.getTime();

    bhotm.create(thisMonth, function (err, newMonth) {
        //Add new month to database
        if (err) {
            console.log(err);
        } else {
            res.redirect("/bhotm/admin");
        }
    });
});

// Trying to get a specific month by ID redirects you back to main BHotM page
// TODO - make specific month page? maybe with more info?
router.get("/bhotmold/:id", function (req, res) {
    res.redirect("/bhotm");
});

// EDIT - Edit existing bhotm
router.get("/bhotmold/:id/edit", bmHelpers.isAdmin, function (req, res) {
    bhotm
        .findById(req.params.id)
        .populate("entries.boy")
        .exec(function (err, bhotmold) {
            if (err) {
                console.log(err);
            } else {
                Boy.find({}, function (err, boys) {
                    res.render("bhotm/edit", {
                        pageName: "Edit BHotM",
                        bhotmold: bhotmold,
                        boys: boys,
                    });
                });
            }
        });
});

// PUT - Updates a month after an edit
router.put("/bhotmold/:id", bmHelpers.isAdmin, function (req, res) {
    var thisMonth = bmHelpers.bhotm.processMonth(req.body.bhotm);

    bhotm.findByIdAndUpdate(req.params.id, thisMonth, function (
        err,
        updateMonth
    ) {
        //Update month in database
        if (err) {
            console.log(err);
        } else {
            res.redirect("/bhotm/admin");
        }
    });
});

// DELETE - Deletes specified BHoTM
router.delete("/bhotmold/:id", bmHelpers.isAdmin, function (req, res) {
    bhotm.deleteOne({ _id: req.params.id }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/bhotm/admin");
        }
    });
});

router.get("/bhotm*", function (req, res) {
    res.render("react", {
        pageName: "Ben Haqle of the Month",
        reactScript: "bhotm",
    });
});

// BHotM Index
router.get("/api/bhotm/", function (req, res) {
    bhotm
        .find({ hasBeenJudged: true })
        .populate("submissions")
        .sort({ date: -1, "submissions.place": 1 })
        .exec(function (err, month) {
            if (err) {
                console.log(err);
            } else {
                res.json(month);
            }
        });
});

module.exports = router;
