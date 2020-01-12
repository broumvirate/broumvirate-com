//////////////////
// MODULE SETUP
//////////////////

const express      	               = require("express"),
	  passport	                   = require("passport"),
	  LocalStrategy                  = require("passport-local"),
	  passportLocalMongoose          = require("passport-local-mongoose"),
	  bodyParser  	               = require("body-parser"),
	  mongoose     	               = require("mongoose"),
	  methodOverride                 = require("method-override")

const app = express()	 //Init app


const indexRouter                    = require("./routes/index"),
	  authRouter	                   = require("./routes/auth"),
	  rateRouter                     = require("./routes/rate")

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"))




//////////////////
// DATABASE SETUP
//////////////////

// mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, });
mongoose.connect("mongodb+srv://dbUser:2tZjrPcSr2VrwWx6@broumvirate-com-wvuvq.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, });


/////////////////
// AUTH SETUP
/////////////////

app.use(require("express-session")({
	secret: "butt butt",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session())

app.use(function(req, res, next){
	res.locals.currentUser = req.user
	res.locals.pageName = ""
	if(req.user){
		User.findById(req.user.id, function(error, result){
			if(error){
				console.log(error)
			} else{
				res.locals.currentUsername = result.fname;
				next();
			}
		})
	} else{
		next();
	}
})



//////////////////
// DATABASE SCHEMA
//////////////////

const Boy             = require("./models/boy"),
	  User            = require("./models/user"),
	  Rating          = require("./models/rating"),
      RateCategory    = require("./models/category")

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//////////////////
// ROUTES
//////////////////

app.use(indexRouter);
app.use(rateRouter);
app.use(authRouter);


////////////////
// INIT
////////////////

// app.listen(process.env.PORT || 5000, process.env.IP, function(){
// 	console.log("Broumvirate production server running on port 3000!")
// })

app.listen(3000, function(){
	console.log("Broumvirate testing server running on port 3000!")
})