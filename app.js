//////////////////
// MODULE SETUP
//////////////////

const express = require("express"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
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
    bhotmMonthsRouter = require("./routes/bhotmMonths"),
    bhotmEntriesRouter = require("./routes/bhotmEntries"),
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
    useCreateIndex: true,
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
app.use("/api/bhotm/month/", bhotmMonthsRouter);
app.use("/api/bhotm/entry/", bhotmEntriesRouter);
app.use(authRouter);
app.use(adminRouter);
app.use(gameRouter);

////////////////
// API ERROR HANDLING
////////////////
app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    if (req.originalUrl.split("/")[1] === "api") {
        console.error(req.originalUrl, err); // Some work could be done making this not SUCC
        const code = Array.isArray(err) ? err[0].code : err.code;
        res.status(code).json({ errors: err });
    } else {
        return next(err);
    }
});

////////////////
// INIT
////////////////

app.listen(3000, function () {
    console.log("Broumvirate server running on port 3000!");
});
