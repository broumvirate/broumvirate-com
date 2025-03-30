//////////////////
// MODULE SETUP
//////////////////

const express = require("express"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    rateLimit = require("express-rate-limit"),
    dotEnv = require("dotenv");

dotEnv.config();
let DATABASEURL, RandomMemeGenerator;

if (process.env.NODE_ENV !== "production") {
    // Development/staging
    //RandomMemeGenerator = require("../Coding/random-meme-generator").default;
    RandomMemeGenerator = require("random-meme-generator").default;
    DATABASEURL = process.env.DATABASEPRODURL;
} else {
    // Production
    RandomMemeGenerator = require("random-meme-generator").default;
    DATABASEURL = process.env.DATABASEURL;
}

/////////////////
// INIT APP
/////////////////

const app = express();

app.use(express.static("public"));
// app.use("/src", express.static("src"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

mongoose.connect(DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

/////////////////
// AUTH SETUP
/////////////////

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

//////////////////
// RATE LIMITING
//////////////////

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 250,
});

app.use(limiter);

////////////////
// AUTH & LOCALS
////////////////

const User = require("./models/user");

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.pageName = "";
    res.locals.version = process.env.VERSION;
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

/////////////////
// ROUTES SETUP
/////////////////

const indexRouter = require("./routes/index"),
    authRouter = require("./routes/auth"),
    rateRouter = require("./routes/rate"),
    bhotmRouter = require("./routes/bhotm"),
    bhotmMonthsRouter = require("./routes/bhotmMonths"),
    bhotmEntriesRouter = require("./routes/bhotmEntries"),
    bhotmBoysRouter = require("./routes/bhotmBoys");
    adminRouter = require("./routes/admin"),
    gameRouter = require("./routes/games");

const bhothmGenerator = new RandomMemeGenerator(mongoose.connection, {
    textCollectionName: "bhothmText",
    textWildcardsAllowed: true,
    storeMemesInDB: true,
    templateCollectionName: "memeTemplate",
    templateWildcard: "*",
    textWildcard: "*",
    apiUrl: "https://api.memegen.link",
});

//////////////////
// ROUTES
//////////////////

app.use(indexRouter);
app.use(rateRouter);
app.use(bhotmRouter);
app.use("/api/bhotm/month/", bhotmMonthsRouter);
app.use("/api/bhotm/entry/", bhotmEntriesRouter);
app.use("/api/bhotm/boy/", bhotmBoysRouter);
app.use("/api/bhothm", bhothmGenerator.express());
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
        if (!Array.isArray(err)) {
            err = [err];
        }
        const code = err[0].code;
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
