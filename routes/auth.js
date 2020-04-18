var express = require("express");
var router = express.Router()
var passport = require("passport")
var bmHelpers = require("../bmHelpers")

var Boy             = require("../models/boy"),
	User            = require("../models/user")

// REGISTER INDEX
router.get("/register", function(req, res){
	Boy.find({registered: false}, function(err, boys){
		if(err){
			console.log(err)
		}else{
			res.render("register", {boys:boys, pageName: "Register", currentUser:req.user});
		}
	}).sort("bid")
})

// REGISTER POST
router.post("/register", function(req, res){
	Boy.findByIdAndUpdate(req.body.boy, {registered:true}, function(error, result){
		if(error){
			console.log(error)
		}else{
			User.register(new User({username: req.body.username, boy:result, fname:result.name}), req.body.password, function(err, user){
				if(err){
					console.log(err);
					return res.redirect("/register");
				}
				passport.authenticate("local")(req, res, function(){
					res.redirect("/")
				})
			})
		}
	})
})

// LOGIN INDEX
router.get("/login", function(req, res){
	res.render("login", {pageName:"Log In", });
})

// LOGIN POST
router.post("/login", passport.authenticate("local", {
	successRedirect:"/",
	failureRedirect:"/login"
}), function(req, res){})

// LOGOUT
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/")
})


module.exports = router;