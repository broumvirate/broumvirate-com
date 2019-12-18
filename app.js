//////////////////
// SETUP
//////////////////
var express      = require("express"),
	app          = express(),
	bodyParser   = require("body-parser"),
	mongoose     = require("mongoose");
	methodOverride = require("method-override")

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"))

//////////////////
// SCHEMA
//////////////////

var Boy = require("./models/boy")
var Rating = require("./models/rating")
var RateCategory = require("./models/category")

//////////////////
// ROUTES
//////////////////

// INDEX - Homepage
app.get("/", function(req, res){
	res.render("home", {pageName:"Home"});
})

app.get("/contact", function(req, res){
	res.render("contact", {pageName:"Contact"});
})

app.get("/music", function(req, res){
	res.render("music", {pageName:"Music"});
})

app.get("/games", function(req, res){
	res.render("games", {pageName:"Games"});
})

app.get("/fuckmeinthehouse", function(req, res){
	res.render("fuckmeinthehouse", {pageName:"Fuck Me In The House"});
})

//////////////////
// RATINGS ROUTES
//////////////////

//INDEX - List of all ratings
app.get("/rate", function(req, res){
	Rating.find({}, function(err, results){
		if(err){
			console.log(err);
		}
		else{
			res.render("rate/index", {ratings:results, pageName: "Ratings", page:req.url})
		}
	}).sort("category")
})

//CREATE - Creates a new rating FROM a POST request (/rating/new)
app.post("/rate", function(req, res){
	var newRating = req.body.rateMetadata						//Gets rating metadata, sets up the array of ratings
	newRating.rates = [];
	var ratingValues = Object.values(req.body.rates1)			//parses the rating values as individiual arrays [[boyName, rating], ...]
	var ratingBoys = Object.keys(req.body.rates1)
	
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
app.get("/rate/new", function(req, res){
	Boy.find({}, function(err, boys){
		if(err){
			console.log(err)
		} else{
			RateCategory.find({}, function(err, categories){
				if(err){
					console.log(err)
				} else{
					res.render("rate/new", {boys: boys, categories:categories, pageName:"New Rating"});
				}
			}).sort("category")
		}
	})
})

//NEW CATEGORY
app.get("/rate/category/new", function(req, res){
	res.render("rate/newCategory", {pageName:"New Category"});
})

//NEW CATEGORY
app.post("/rate/category", function(req, res){
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
app.get("/rate/:id", function(req, res){
	Rating.findById(req.params.id).populate("rates.boy").exec(function(err, rating){
		if(err){
			console.log(err);
		} else{
			Rating.find({}, function(err, ratings){
				if (err){
					console.log(err)
				} else{
					res.render("rate/show", {rating:rating, ratings:ratings, pageName:"Ratings", page:req.url});	
				}
			}).sort("category")
		}
	})
})

//EDIT - Edit a specified rating
app.get("/rate/:id/edit", function(req, res){
	Rating.findById(req.params.id).populate("rates.boy").exec(function(err, rating){
		if(err){
			console.log(err);
		} else{
			RateCategory.find({}, function(err, categories){
				if(err){
					console.log(err)
				} else{
					res.render("rate/edit", {rating:rating, categories:categories, pageName:"Ratings"});	
				}
			}).sort("category")
		}

	})
})

//PUT - Updates a rating from the edit page
app.put("/rate/:id", function(req, res){
	var newRating = req.body.rateMetadata						//Gets rating metadata, sets up the array of ratings
	newRating.rates = [];
	var ratingValues = Object.values(req.body.rates1)			//parses the rating values as individiual arrays [[boyName, rating], ...]
	var ratingBoys = Object.keys(req.body.rates1)
	
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
app.delete("/rate/:id", function(req, res){
	Rating.deleteOne({"_id" : req.params.id}, function(err){
		if(err){
			console.log(err);
		} else{
			res.redirect("/rate");	
		}

	})
})



////////////////
// INIT
////////////////

app.listen(process.env.PORT || 5000, process.env.IP, function(){
	console.log("Broumvirate production server running on port 3000!")
})

// app.listen(3000, function(){
// 	console.log("Broumvirate testing server running on port 3000!")
// })