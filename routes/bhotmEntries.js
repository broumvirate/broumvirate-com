const express = require("express");
const router = express.Router();
const bmHelpers = require("../bmHelpers");
const dayjs = require("dayjs");

const Boy = require("../models/boy"),
    User = require("../models/user"),
    { bhotm } = require("../models/bhotm"),
    { bhotmEntry } = require("../models/bhotm");

// Entry list
router.get("/", function (req, res) {
    bhotmEntry
        .find()
        .sort({ date: -1 })
        .exec(function (err, entr) {
            if (err) {
                console.log(err);
            } else {
                res.json(entr);
            }
        });
});

// Entry unjudged
router.get("/unjudged", function (req, res) {
    bhotmEntry.find({ hasBeenJudged: false }).exec(function (err, entr) {
        if (err) {
            console.log(err);
        } else {
            res.json(entr);
        }
    });
});

// Entry get
router.get("/:id", function (req, res) {
    bhotmEntry
        .findById(req.params.id)
        .populate("month")
        .exec(function (err, entr) {
            if (err) {
                console.log(err);
            } else {
                res.json(entr);
            }
        });
});

// Entry create
router.post("/entry", function (req, res) {
    // Process entry
    bhotmEntry.create(res.body, function (err, entr) {
        if (err) {
            console.log(err);
        } else {
            res.json(entr);
        }
    });
});

// Entry update
router.put("/:id", bmHelpers.isAdmin, function (req, res) {
    // Process entry
    bhotmEntry.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        function (err, entr) {
            if (err) {
                console.log(err);
            } else {
                res.json(entr);
            }
        }
    );
});

// Entry delete
router.delete("/:id", bmHelpers.isAdmin, function (req, res) {
    console.log("delete entry", req.params.id);
    // bhotmEntry.deleteOne({ _id: req.params.id }, function (err) {
    //     if (err) {
    //         res.send(err);
    //     } else {
    //         res.redirect("/");
    //         //res.json({ message: "entry deleted" });
    //     }
    // });
});

module.exports = router;
