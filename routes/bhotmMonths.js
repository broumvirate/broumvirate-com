const express = require("express");
const router = express.Router();
const bmHelpers = require("../bmHelpers");
const dayjs = require("dayjs");

const Boy = require("../models/boy"),
    User = require("../models/user"),
    { bhotm } = require("../models/bhotm"),
    { bhotmEntry } = require("../models/bhotm");

const { coerce, validate } = require("superstruct");
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
    let errors = [];
    try {
        if (req.body.month) {
            newMonth = new bhotm(JSON.parse(req.body.month));
            if (!newMonth.date) {
                newMonth.date = dayjs().format();
            }
        } else if (req.body.type) {
            newMonth = await newBhotmMonthTypes(req.body);
        } else {
            throw "error";
        }
    } catch {
        errors.push({
            code: 400,
            title: "Unable to parse month",
        });
    }
    if (errors) {
        next(errors);
    } else {
        newMonth.save().then((month, err) => {
            if (err) {
                errors.push({
                    code: 500,
                    title: "Unable to save month",
                    detail: err,
                });
                next(errors);
            }
            res.json(month);
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
router.delete("/:id", bmHelpers.isAdmin, function (req, res, next) {
    console.log("wanna delete it");
    bhotm
        .deleteOne({ _id: req.body.id })
        .then((data) => res.json({ completed: true, deleted: data }))
        .catch((err) =>
            next([{ code: 400, title: "Unable to delete month", details: err }])
        );
});

async function newBhotmMonthTypes(params) {
    let filter = {};
    let limit = 1000;
    let month = new bhotm();
    let now = dayjs();
    let string = "";

    switch (params.type) {
        case "bhoty":
            filter = { place: 1 };
            limit = 13;
            string = `BHotY ${now.format("YYYY")}`;
            break;
        case "month":
            filter = { hasBeenJudged: false };
            string = `${now.format("MMM. YYYY")}`;
            break;
        case "blank":
            month.date = now.format();
            month.month = `Blank Month, ${now.format("MMM. YYYY")}`;
            return month;
        default:
            throw "error";
    }
    return bhotmEntry
        .find(filter)
        .sort({ date: -1 })
        .limit(limit)
        .then((results) => {
            month.month = string;
            month.date = now.format();
            month.isBhoty = params.type === "bhoty";
            month.submissions = results;
            return month;
        })
        .catch((error) => {
            throw error;
        });
}

module.exports = router;
