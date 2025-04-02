const express = require("express");
const router = express.Router();
const bmHelpers = require("../bmHelpers");
const dayjs = require("dayjs");
const { EntryValidator } = require("../validators/bhotm.js");

const Boy = require("../models/boy"),
    User = require("../models/user"),
    { bhotm } = require("../models/bhotm"),
    { bhotmEntry } = require("../models/bhotm");

// Entry list
router.get("/", bmHelpers.isAdmin, function (req, res, next) {
    let find = {
        isDeleted: false,
    };
    if (req.query.filter === "unjudged") {
        find.hasBeenJudged = false;
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
router.get("/:id", function (req, res, next) {
    bhotmEntry
        .findById(req.params.id)
        .populate("month")
        .populate("boy")
        .then((data) => {
            if (req.isAuthenticated() || !data.requiresLogin) {
                return res.json(data);
            } else {
                return next([{ code: 401, title: "Unauthorized" }]);
            }
        })
        .catch((e) =>
            next([{ code: 400, title: "Unable to get entry", details: e.path }])
        );
});

// Entry create
router.post("/", async function (req, res, next) {
    try {
        const sanitizedEntry = bmHelpers.bhotm.sanitizeEntry(req.body.entry); // Sanitize out some values that the user could manipulate to win
        const newEntry = EntryValidator.cast(sanitizedEntry); // Cast some default fields
        await EntryValidator.validate(newEntry, { abortEarly: false });
        const { format, link } = bmHelpers.bhotm.getEntryType(newEntry.link); // Get/set format and updated embed link
        newEntry.link = link;
        newEntry.format = format;
        if (req.isAuthenticated()) {
            newEntry.user = req.user._id; // Put in the user
        }

        bhotmEntry
            .create(newEntry)
            .then((data) => {
                res.json(data); // Send the created entry as a JSON response
            })
            .catch((err) => {
                next([
                    {
                        code: 500,
                        title: "Unable to create entry",
                        details: err,
                    },
                ]);
            });
    } catch (e) {
        next([
            {
                code: 400,
                title: "Unable to validate entry",
                details: e.message,
                fullError: e,
            },
        ]);
    }
});

// Entry update
router.put("/:id", bmHelpers.isAdmin, function (req, res, next) {
    const newEntry = { ...req.body.entry };
    const { format, link } = bmHelpers.bhotm.getEntryType(newEntry.link); // Get/set format and updated embed link
    newEntry.link = link;
    newEntry.format = format;
    newEntry.entryMethod = "form";
    newEntry.edited = true;
    newEntry.lastEditedDate = new Date();
    delete newEntry.month;
    delete newEntry.place;
    delete newEntry.isWinner;
    delete newEntry.bhotyPlace;
    delete newEntry.user;
    delete newEntry.date;
    delete newEntry._id;
    if (EntryValidator.isValid(newEntry)) {
        bhotmEntry
            .findByIdAndUpdate(req.params.id, newEntry, { new: true })
            .then((data) => res.json(data))
            .catch((err) =>
                next([
                    {
                        code: 500,
                        title: "Unable to update entry",
                        details: err,
                    },
                ])
            );
    } else {
        next({ code: 400, title: "Entry does not conform" });
    }
});

// Entry delete
// this gonna cause problemos, need to remove references from month. kill me
router.delete("/:id", bmHelpers.isAdmin, function (req, res, next) {
    bhotm
        .find({ submissions: req.params.id })
        .then((mons) => {
            if (mons.length === 0) {
                return bhotmEntry.deleteOne({ _id: req.params.id });
            } else {
                return bhotmEntry.findByIdAndUpdate(req.params.id, {
                    name: "Entry Deleted",
                    email: undefined,
                    entryName: undefined,
                    entryDescription: undefined,
                    boy: [],
                    user: undefined,
                    clickLink: undefined,
                    link: undefined,
                    format: "deleted",
                    isDeleted: true,
                    edited: true,
                    lastEditedDate: new Date(),
                });
            }
        })
        .then((data) => res.json({ completed: true, deleted: data }))
        .catch((err) =>
            next([{ code: 400, title: "Unable to delete entry", details: err }])
        );
});

module.exports = router;
