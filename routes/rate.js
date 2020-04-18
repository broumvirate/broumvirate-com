const express = require("express");
const router = express.Router()
var bmHelpers = require("../bmHelpers")

const Boy             = require("../models/boy"),
	  Rating          = require("../models/rating"),
      RateCategory    = require("../models/category")



//INDEX - List of all ratings
router.get("/rate", bmHelpers.isLoggedIn, function(req, res){
	Rating.find({}, function(err, results){
		if(err){
			console.log(err);
		}
		else{
			res.render("rate/index", {ratings:results, pageName: "Ratings", page:req.url, })
		}
	}).sort("category")
})


//CREATE - Creates a new rating FROM a POST request (/rating/new)
router.post("/rate", bmHelpers.isLoggedIn, function(req, res){
	let newRating = req.body.rateMetadata						//Gets rating metadata, sets up the array of ratings
	newRating.rates = [];
	const ratingValues = Object.values(req.body.rates1)			//parses the rating values as individiual arrays [[boyName, rating], ...]
	const ratingBoys = Object.keys(req.body.rates1)
	
	Boy.find().where('_id').in(ratingBoys).exec(function(err, boys){
		if(err){
			console.log(err);
		} else{
			for (i=0; i<boys.length;i++){
				newRating.rates.push({
					"boy":boys[i],
					"value1":Number(ratingValues[i])
				})
			}
			
			Rating.create(newRating, function(err, rating){				//Add rating to the database
			if(err){
				console.log(err)
			} else{
				res.redirect("/rate");
			}
			})
		}
	})
})


//NEW - Form to create a new rating
router.get("/rate/new", bmHelpers.isLoggedIn, function(req, res){
	Boy.find({}, function(err, boys){
		if(err){
			console.log(err)
		} else{
			RateCategory.find({}, function(err, categories){
				if(err){
					console.log(err)
				} else{
					res.render("rate/new", {boys: boys, categories:categories, pageName:"New Rating", });
				}
			}).sort("category")
		}
	}).sort("bid")
})


//CATEGORY INDEX 
router.get("/rate/category/new", bmHelpers.isLoggedIn, function(req, res){
	res.render("rate/newCategory", {pageName:"New Category", });
})

//CATEGORY CREATE
router.post("/rate/category", bmHelpers.isLoggedIn, function(req, res){
	if(req.body.newCat.name && req.body.newCat.category){
		RateCategory.create(req.body.newCat, function(err, result){
		if(err){
			console.log(err)
		}
		res.redirect("/rate")
	})
	}
})

//SHOW - Show a specified rating
router.get("/rate/:id", bmHelpers.isLoggedIn, function(req, res){
	Rating.findById(req.params.id).populate("rates.boy").exec(function(err, rating){
		if(err){
			console.log(err);
		} else{
			Rating.find({}, function(err, ratings){
				if (err){
					console.log(err)
				} else{
					res.render("rate/show", {rating:rating, ratings:ratings, pageName:"Ratings", page:req.url, });	
				}
			}).sort("category")
		}
	})
})

//EDIT - Edit a specified rating
router.get("/rate/:id/edit", bmHelpers.isLoggedIn, function(req, res){
	Rating.findById(req.params.id).populate("rates.boy").exec(function(err, rating){
		if(err){
			console.log(err);
		} else{
			RateCategory.find({}, function(err, categories){
				if(err){
					console.log(err)
				} else{
					res.render("rate/edit", {rating:rating, categories:categories, pageName:"Ratings", });	
				}
			}).sort("category")
		}

	})
})

//PUT - Updates a rating from the edit page
router.put("/rate/:id", bmHelpers.isLoggedIn, function(req, res){
	let newRating = req.body.rateMetadata						//Gets rating metadata, sets up the array of ratings
	newRating.rates = [];
	const ratingValues = Object.values(req.body.rates1)			//parses the rating values as individiual arrays [[boyName, rating], ...]
	const ratingBoys = Object.keys(req.body.rates1)
	
	Boy.find().where('_id').in(ratingBoys).exec(function(err, boys){
		if(err){
			console.log(err);
		} else{
			for (i=0; i<boys.length;i++){
				newRating.rates.push({
					"boy":boys[i],
					"value1":Number(ratingValues[i])
				})
			}
			
			Rating.findByIdAndUpdate(req.params.id, newRating, function(err, rating){				//Add rating to the database
			if(err){
				console.log(err)
			} else{
				res.redirect("/rate/"+req.params.id);
			}
			})
		}
	})
})

//DELETE - Deletes a rating
router.delete("/rate/:id", bmHelpers.isLoggedIn, function(req, res){
	Rating.deleteOne({"_id" : req.params.id}, function(err){
		if(err){
			console.log(err);
		} else{
			res.redirect("/rate");	
		}

	})
})

module.exports = router;