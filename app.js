//////////////////
// MODULE SETUP
//////////////////

const express = require("express"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    dotEnv = require("dotenv");

dotEnv.config();

/////////////////
// ROUTES SETUP
/////////////////

const indexRouter = require("./routes/index"),
    authRouter = require("./routes/auth"),
    rateRouter = require("./routes/rate"),
    bhotmRouter = require("./routes/bhotm"),
    bhotmAPIRouter = require("./routes/bhotmAPI"),
    adminRouter = require("./routes/admin"),
    gameRouter = require("./routes/games");

/////////////////
// SCHEMA SETUP
/////////////////

const Boy = require("./models/boy"),
    User = require("./models/user"),
    Rating = require("./models/rating"),
    RateCategory = require("./models/category"),
    { bhotm } = require("./models/bhotm"),
    Nick = require("./models/nick");

/////////////////
// INIT APP
/////////////////

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

/////////////////
// AUTH SETUP
/////////////////

app.use(
    require("express-session")({
        secret: "butt butt",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

////////////////
// RES LOCALS
////////////////

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.pageName = "";
    if (req.user) {
        User.findById(req.user.id)
            .populate("boy")
            .exec(function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    res.locals.currentUser = result;
                    next();
                }
            });
    } else {
        next();
    }
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////////////
// ROUTES
//////////////////

app.use(indexRouter);
app.use(rateRouter);
app.use(bhotmRouter);
app.use("/api/bhotm", bhotmAPIRouter);
app.use(authRouter);
app.use(adminRouter);
app.use(gameRouter);

////////////////
// INIT
////////////////

app.listen(3000, function () {
    console.log("Broumvirate server running on port 3000!");
});
