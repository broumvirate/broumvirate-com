const express = require("express");
const router = express.Router();
var bmHelpers = require("../bmHelpers");

const Boy = require("../models/boy"),
    Rating = require("../models/rating"),
    RateCategory = require("../models/category");

//INDEX - List of all ratings
router.get("/rate", bmHelpers.isLoggedIn, function (req, res) {
    Rating.find({})
        .sort("category")
        .then((results) => {
            res.render("rate/index", {
                ratings: results,
                pageName: "Ratings",
                page: req.url,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

//CREATE - Creates a new rating FROM a POST request (/rating/new)
router.post("/rate", bmHelpers.isLoggedIn, function (req, res) {
    processRating(req.body.rateMetadata, req.body.rates1).then((newRating) => {
        Rating.create(newRating)
            .then((rating) => {
                res.redirect("/rate/" + rating._id);
            })
            .catch((err) => console.log(err));
    });
});

//NEW - Form to create a new rating
router.get("/rate/new", bmHelpers.isLoggedIn, function (req, res) {
    Boy.find({ "flags.canRate": true })
        .sort("bid")
        .exec()
        .then((boys) => {
            return RateCategory.find()
                .sort("category")
                .exec()
                .then((categories) => {
                    res.render("rate/new", {
                        boys: boys,
                        categories: categories,
                        pageName: "New Rating",
                    });
                });
        })
        .catch((err) => console.log(err));
});

//CATEGORY INDEX
router.get("/rate/category/new", bmHelpers.isLoggedIn, function (req, res) {
    res.render("rate/newCategory", { pageName: "New Category" });
});

//CATEGORY CREATE
router.post("/rate/category", bmHelpers.isLoggedIn, function (req, res) {
    if (req.body.newCat.name && req.body.newCat.category) {
        RateCategory.create(req.body.newCat)
            .then(() => res.redirect("/rate"))
            .catch((err) => console.log(err));
    }
});

//SHOW - Show a specified rating
router.get("/rate/:id", bmHelpers.isLoggedIn, function (req, res) {
    Rating.findById(req.params.id)
        .populate("rates.boy")
        .exec()
        .then((rating) => {
            return Rating.find()
                .sort("category")
                .then((ratings) => {
                    res.render("rate/show", {
                        rating: rating,
                        ratings: ratings,
                        pageName: "Ratings",
                        page: req.url,
                    });
                });
        })
        .catch((err) => console.log(err));
});

//EDIT - Edit a specified rating
router.get("/rate/:id/edit", bmHelpers.isLoggedIn, function (req, res) {
    Rating.findById(req.params.id)
        .populate("rates.boy")
        .exec()
        .then((rating) => {
            return RateCategory.find()
                .sort("category")
                .then((categories) => {
                    res.render("rate/edit", {
                        rating: rating,
                        categories: categories,
                        pageName: "Ratings",
                    });
                });
        })
        .catch((err) => console.log(err));
});

//PUT - Updates a rating from the edit page
router.put("/rate/:id", bmHelpers.isLoggedIn, function (req, res) {
    processRating(req.body.rateMetadata, req.body.rates1).then((newRating) => {
        Rating.findByIdAndUpdate(req.params.id, newRating)
            .then((rating) => {
                res.redirect("/rate/" + rating._id);
            })
            .catch((err) => console.log(err));
    });
});

//DELETE - Deletes a rating
router.delete("/rate/:id", bmHelpers.isLoggedIn, function (req, res) {
    Rating.deleteOne({ _id: req.params.id })
        .then(() => res.redirect("/rate"))
        .catch((err) => console.log(err));
});

module.exports = router;

function processRating(rating, rates1) {
    rating.rates = [];
    const ratingValues = Object.values(rates1); //parses the rating values as individiual arrays [[boyName, rating], ...]
    const ratingBoys = Object.keys(rates1);
    let p = new Promise((resolve, reject) => {
        Boy.find()
            .where("_id")
            .in(ratingBoys)
            .exec((err, boys) => {
                if (err) {
                    reject(err);
                } else {
                    rating.rates = boys.map((b, i) => {
                        return { boy: b, value1: Number(ratingValues[i]) };
                    });
                    resolve(rating);
                }
            });
    });
    return p;
}
