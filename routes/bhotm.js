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
        .find({ hasBeenJudged: true })
        .sort({ date: -1, "entries.place": 1 })
        .populate("submissions")
        .then(bhotmData => {
            res.render("bhotm/index", {
                pageName: "Ben Hagle of the Month",
                bhotm: bhotmData,
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        });
});

// ADMIN INDEX - Admin page, available only to admins like Ben Hagle
router.get("/bhotmold/admin", bmHelpers.isAdmin, function (req, res) {
    bhotm
        .find({})
        .sort("-date")
        .populate("entries.boy")
        .then(bhotmData => {
            res.render("bhotm/admin", {
                pageName: "BHotM Admin",
                bhotm: bhotmData,
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        });
});

// NEW
router.get("/bhotmold/new", bmHelpers.isAdmin, function (req, res) {
    Boy.find({})
        .then(boys => {
            res.render("bhotm/new", {
                pageName: "New BHotM",
                entries: req.query.entries,
                boys: boys,
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect("/bhotm/admin");
        });
});

// CREATE -- Add new BHotM from creation page
router.post("/bhotmold", bmHelpers.isAdmin, function (req, res) {
    var thisMonth = bmHelpers.bhotm.processMonth(req.body.bhotm);
    var d = new Date();
    thisMonth.date = d.getTime();

    bhotm.create(thisMonth)
        .then(() => {
            res.redirect("/bhotm/admin");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/bhotm/admin");
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
        .then(bhotmold => {
            return Boy.find({})
                .then(boys => {
                    res.render("bhotm/edit", {
                        pageName: "Edit BHotM",
                        bhotmold: bhotmold,
                        boys: boys,
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.redirect("/bhotm/admin");
        });
});

// PUT - Updates a month after an edit
router.put("/bhotmold/:id", bmHelpers.isAdmin, function (req, res) {
    var thisMonth = bmHelpers.bhotm.processMonth(req.body.bhotm);

    bhotm.findByIdAndUpdate(req.params.id, thisMonth)
        .then(() => {
            res.redirect("/bhotm/admin");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/bhotm/admin");
        });
});

// DELETE - Deletes specified BHoTM
router.delete("/bhotmold/:id", bmHelpers.isAdmin, function (req, res) {
    bhotm.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect("/bhotm/admin");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/bhotm/admin");
        });
});

router.get("/bhotm*", function (req, res) {
    res.render("react", {
        pageName: "Ben Haqle of the Month",
        reactScript: "bhotm",
    });
});

// BHotM Index
router.get("/api/bhotm/", function (req, res, next) {
    bhotm
        .find({ hasBeenJudged: true })
        .populate("submissions")
        .sort({ date: -1, "submissions.place": 1 })
        .then(months => {
            res.json(months);
        })
        .catch(err => {
            next([
                { code: 500, title: "Unable to get BHotMs", details: err },
            ]);
        });
});

module.exports = router;
