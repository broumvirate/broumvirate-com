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
router.get("/:id", function (req, res, next) {
    bhotmEntry
        .findById(req.params.id)
        .populate("month")
        .then((data) => res.json(data))
        .catch((e) =>
            next([{ code: 400, title: "Unable to get entry", details: e.path }])
        );
});

// Entry create
router.post("/", async function (req, res, next) {
    let newEntry;
    try {
        console.log(req.body);
        const sanitizeEntry = bmHelpers.bhotm.sanitizeEntry(req.body.entry); // Sanitize out some values that the user could manipulate to win
        newEntry = EntryValidator.cast(sanitizeEntry); // Cast some default fields
        await EntryValidator.validate(newEntry, { abortEarly: false });
        const { format, link } = bmHelpers.bhotm.getEntryType(newEntry.link); // Get/set format and updated embed link
        newEntry.link = link;
        newEntry.format = format;
        if (req.isAuthenticated()) {
            newEntry.user = req.user._id; //Put in the user
        }
        bhotmEntry.create(newEntry, function (err, data) {
            if (err) {
                next([
                    {
                        code: 500,
                        title: "Unable to create entry",
                        details: err,
                    },
                ]);
            } else {
                res.json(data);
            }
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
    let newEntry = Object.create(req.body.entry);
    const { format, link } = bmHelpers.bhotm.getEntryType(newEntry.link); // Get/set format and updated embed link
    newEntry.link = link;
    newEntry.format = format;
    newEntry.entryMethod = "form";
    newEntry.edited = true;
    newEntry.lastEditedDate = dayjs().format();
    delete newEntry.month;
    delete newEntry.user;
    if (is(newEntry, EntryValidator)) {
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
    bhotmEntry
        .deleteOne({ _id: req.params.id })
        .then((data) => res.json({ completed: true, deleted: data }))
        .catch((err) =>
            next([{ code: 400, title: "Unable to delete entry", details: err }])
        );
});

module.exports = router;
