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
    let find = {};
    if (req.query.filter === "unjudged") {
        find = { hasBeenJudged: false };
    }
    bhotmEntry
        .find(find)
        .sort({ date: -1 })
        .then((data) => res.json(data))
        .catch((err) =>
            next([{ code: 500, title: "Unable to get entries", details: err }])
        );
});

// Entry get
router.get("/:id", function (req, res) {
    bhotmEntry
        .findById(req.params.id)
        .populate("month")
        .then((data) => res.json(data))
        .catch((err) =>
            next([{ code: 400, title: "Unable to get entry", details: err }])
        );
});

// Entry create
router.post("/entry", function (req, res) {
    // Process entry
    bhotmEntry
        .create(res.body)
        .then((data) => res.json(data))
        .catch((err) =>
            next([{ code: 500, title: "Unable to create entry", details: err }])
        );
});

// Entry update
router.put("/:id", bmHelpers.isAdmin, function (req, res) {
    // Process entry
    bhotmEntry
        .findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((data) => res.json(data))
        .catch((err) =>
            next([{ code: 500, title: "Unable to update entry", details: err }])
        );
});

// Entry delete
router.delete("/:id", bmHelpers.isAdmin, function (req, res) {
    console.log("delete entry", req.params.id);
    bhotmEntry
        .deleteOne({ _id: req.params.id })
        .then((data) => res.json({ completed: true, deleted: data }))
        .catch((err) =>
            next([{ code: 400, title: "Unable to delete entry", details: err }])
        );
});

module.exports = router;
