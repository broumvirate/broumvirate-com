const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const rateRouter = require("./routes/rate");
const bhotmRouter = require("./routes/bhotm");
const bhotmMonthsRouter = require("./routes/bhotmMonths");
const bhotmEntriesRouter = require("./routes/bhotmEntries");
const bhotmBoysRouter = require("./routes/bhotmBoys");
const adminRouter = require("./routes/admin");
const gameRouter = require("./routes/games");
const RandomMemeGenerator = require("random-meme-generator").default;

module.exports = function setupRoutes(app, mongoose) {
    const bhothmGenerator = new RandomMemeGenerator(mongoose.connection, {
        textCollectionName: "bhothmText",
        textWildcardsAllowed: true,
        storeMemesInDB: true,
        templateCollectionName: "memeTemplate",
        templateWildcard: "*",
        textWildcard: "*",
        apiUrl: "https://api.memegen.link",
    });

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
};