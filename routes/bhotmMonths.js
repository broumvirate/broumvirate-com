const express = require("express");
const router = express.Router();
const bmHelpers = require("../bmHelpers");
const dayjs = require("dayjs");

const Boy = require("../models/boy"),
    User = require("../models/user"),
    { bhotm } = require("../models/bhotm"),
    { bhotmEntry } = require("../models/bhotm");

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

router.post("/", bmHelpers.isAdmin, async function (req, res, next) {
    let newMonth;
    try {
        if (req.body.month) {
            // Try to process the pre-made month. Need to sanitize, probably/
            newMonth = MonthValidator.cast(JSON.parse(req.body.month));
        } else if (req.body.type) {
            // Alternatively, get a premade month from the generator
            newMonth = await generateBhotmMonth(req.body.type);
        } else {
            throw "error";
        }

        // Validate the month, then add it to the database
        if (MonthValidator.isValidSync(newMonth)) {
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
    } catch {
        next({
            code: 400,
            title: "Unable to parse input",
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
    try {
        const sortedPlaces = req.body.month.places.sort(
            (a, b) => a.place - b.place
        );
        const month = { ...req.body.month };
        month.submissions = sortedPlaces.map((el) => el.submission._id);
        if (req.body.judged) {
            month.winner = req.body.month.submissions[0].name;
            month.winnerRef = month.submissions[0];
            month.hasBeenJudged = true;
        }
        MonthValidator.validate(month)
            .then(() => {
                return bhotm.findByIdAndUpdate(month._id, month);
            })
            .then((oldMonth) => {
                if (req.body.changedOrder) {
                    // console.log("Order changed");
                    return Promise.all(
                        month.submissions.map((el, i) => {
                            let update = month.isBhoty
                                ? {
                                      bhotyPlace: sortedPlaces[i].place,
                                  }
                                : { place: i + 1 };
                            update.isWinner = i === 0;
                            if (req.body.judged) {
                                update.hasBeenJudged = true;
                            }
                            if (!month.isBhoty) {
                                update.month = month._id;
                            }
                            return bhotmEntry.findByIdAndUpdate(el, update);
                        })
                    ).then(() => oldMonth);
                } else {
                    return oldMonth;
                }
            })
            .then((month) => res.json(month))
            .catch((error) => {
                console.log(error);
                next({
                    code: 500,
                    title: "Unable to save month",
                    details: error,
                });
            });
    } catch (error) {
        console.log(error);
        next({
            code: 400,
            title: "Unable to parse input",
        });
    }
});

// Month delete
router.delete("/:id", bmHelpers.isAdmin, function (req, res, next) {
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
    let month = MonthValidator.cast({});
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
