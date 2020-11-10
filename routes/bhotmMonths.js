const express = require("express");
const router = express.Router();
const bmHelpers = require("../bmHelpers");
const dayjs = require("dayjs");

const Boy = require("../models/boy"),
    User = require("../models/user"),
    { bhotm } = require("../models/bhotm"),
    { bhotmEntry } = require("../models/bhotm");

router.get("/", bmHelpers.isAdmin, function (req, res) {
    bhotm
        .find({})
        .sort({ date: -1 })
        .then((data) => res.json(data))
        .catch(console.log(err));
});

// Month create
router.post("/new", bmHelpers.isAdmin, function (req, res) {
    bhotmEntry
        .find({ hasBeenJudged: false })
        .sort({ date: 1 })
        .then((results) => {
            let now = dayjs();
            let newMonth = new bhotm();
            newMonth.month = `${now.format("MMM. YYYY")}`;
            newMonth.date = now.format();
            newMonth.submissions = results;
            // do judge
            return newMonth.save();
        })
        .then((month) => {
            res.json(month);
        })
        .catch((err) => console.log(err));
});

// BHoTY Create
router.get("/bhoty", bmHelpers.isAdmin, function (req, res) {
    bhotmEntry
        .find({ place: 1 })
        .sort({ date: -1 })
        .limit(13)
        .then((results) => {
            let now = dayjs();
            let bhoty = new bhotm();
            bhoty.month = `BHotY ${now.format("YYYY")}`;
            bhoty.date = now.format();
            bhoty.isBhoty = true;
            bhoty.submissions = results;
            return bhoty.save();
        })
        .then((bhoty) => {
            res.json(bhoty);
        })
        .catch((err) => console.log(err));
});

// Month get
router.get("/:id", function (req, res) {
    bhotm
        .findById(req.params.id)
        .populate("submissions")
        .sort({ "submissions.place": 1 })
        //.populate({ path: "month", select: "submissions" })
        .exec(function (err, month) {
            if (err) {
                console.log(err);
            } else {
                res.json(month);
            }
        });
});

// Month update
router.put("/:id", bmHelpers.isAdmin, function (req, res) {});

// Month delete
router.delete("/:id", bmHelpers.isAdmin, function (req, res) {
    console.log("delete month", req.params.id);
    // bhotm.deleteOne({ _id: req.params.id }, function (err) {
    //     if (err) {
    //         res.send(err);
    //     } else {
    //         res.json({ message: "month deleted" });
    //     }
    // });
});

module.exports = router;
