//////////////////
// MODULE SETUP
//////////////////

const express = require("express"),
    session = require("express-session"),
    MongoDBStore = require("connect-mongodb-session")(session),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    rateLimit = require("express-rate-limit"),
    dotEnvFlow = require("dotenv-flow");

dotEnvFlow.config();

const app = express();

app.use(express.static("public"));
// app.use("/src", express.static("src"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 250,
});

app.use(limiter);

// Define connection options that work with current MongoDB driver
const mongoConnectionOptions = {
    autoSelectFamily: false
};

// Connect mongoose with options
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASEURL, mongoConnectionOptions)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const store = new MongoDBStore({
    uri: process.env.DATABASEURL,
    databaseName: "broumvirate-com",
    collection: "sessions",
    connectionOptions: mongoConnectionOptions
});

// Handle errors from the session store
store.on("error", function (error) {
    console.error("Session store error:", error);
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(passport.initialize());
app.use(passport.session());

const User = require("./models/user");

app.use(populateLocals);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const setupRoutes = require("./routes.js")
setupRoutes(app, mongoose);

app.use(apiErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Broumvirate server running on port ${port}!`);
});


function populateLocals(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.pageName = "";
    res.locals.version = process.env.VERSION;
    if (req.user) {
        // Update to use promises instead of callback
        User.findById(req.user.id)
            .populate("boy")
            .then(result => {
                res.locals.currentUser = result;
                next();
            })
            .catch(error => {
                console.log(error);
                next();
            });
    } else {
        next();
    }
}

function apiErrorHandler(err, req, res, next) {
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
};