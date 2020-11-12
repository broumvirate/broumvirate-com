const express = require("express");
const router = express.Router();
const bmHelpers = require("../bmHelpers");
const dayjs = require("dayjs");

const Boy = require("../models/boy"),
    User = require("../models/user"),
    { bhotm } = require("../models/bhotm"),
    { bhotmEntry } = require("../models/bhotm");

const { coerce, is } = require("superstruct");
const { MonthValidator } = require("../validators/bhotm.js");

// GET /api/bhotm/month
// Every month without populated entries
router.get("/", function (req, res, next) {
    let find = {};
    if (req.query.filter === "unjudged") {
        find = { hasBeenJudged: false };
    }
    bhotm
        .find(find)
        .sort({ date: -1 })
        .then((data) => res.json(data))
        .catch((err) =>
            next([{ code: 500, title: "Unable to get BHotMs", details: err }])
        );
});

// POST /api/bhotm/month
// Creates a new month based on some params
// Body properties: month - JSON string of pre-created month. Errors out if unparseable or doesn't fit schema
//                  type - either "month", "bhoty", or "blank". Creates a month of unjudged entries, first place entries, or blank month respectively

router.post("/", async function (req, res, next) {
    let newMonth;
    try {
        if (req.body.month) {
            // Try to process the pre-made month. Need to sanitize, probably/
            newMonth = coerce(JSON.parse(req.body.month), MonthValidator);
        } else if (req.body.type) {
            // Alternatively, get a premade month from the generator
            newMonth = await generateBhotmMonth(req.body.type);
        } else {
            throw "error";
        }
    } catch {
        next({
            code: 400,
            title: "Unable to parse input",
        });
    }

    // Validate the month, then add it to the database
    if (is(newMonth, MonthValidator)) {
        bhotm.create(newMonth, (err, month) => {
            if (err) {
                next({
                    code: 500,
                    title: "Unable to save month",
                    detail: err,
                });
            }
            res.json(month);
        });
    } else {
        next({
            code: 400,
            title: "Month invalid",
        });
    }
});

// Month get
router.get("/:id", function (req, res, next) {
    bhotm
        .findById(req.params.id)
        .populate("submissions")
        .sort({ "submissions.place": 1 })
        //.populate({ path: "month", select: "submissions" })
        .then((data) => res.json(data))
        .catch((err) =>
            next([{ code: 400, title: "Unable to get month", details: err }])
        );
});

// Month update
router.put("/:id", bmHelpers.isAdmin, function (req, res, next) {
    // This is a mongo one
});

// Month delete
router.delete("/:id", function (req, res, next) {
    console.log("wanna delete it");
    bhotm.findByIdAndDelete(req.params.id, function (err, data) {
        if (err || !data) {
            next([
                { code: 400, title: "Unable to delete month", details: err },
            ]);
        } else {
            res.json({ completed: true, deleted: data });
        }
    });
});

async function generateBhotmMonth(type) {
    let filter = {};
    let limit = 1000;
    let month = coerce({}, MonthValidator);
    const now = dayjs();

    switch (type) {
        case "bhoty":
            filter = { place: 1 };
            limit = 13;
            month.month = `BHotY ${now.format("YYYY")}`;
            month.isBhoty = true;
            break;
        case "month":
            filter = { hasBeenJudged: false };
            month.month = `${now.format("MMM. YYYY")}`;
            break;
        case "blank":
            month.month = `Blank Month, ${now.format("MMM. YYYY")}`;
            return month;
        default:
            throw "Incorrect Type";
    }
    return bhotmEntry
        .find(filter)
        .sort({ date: -1 })
        .limit(limit)
        .then((results) => {
            month.submissions = results;
            return month;
        })
        .catch((error) => {
            throw error;
        });
}

module.exports = router;
