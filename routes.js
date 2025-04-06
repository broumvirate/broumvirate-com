import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import rateRoutes from './routes/rate.js';
import bhotmRoutes from './routes/bhotm.js';
import bhotmMonths from './routes/bhotmMonths.js';
import bhotmEntries from './routes/bhotmEntries.js';
import bhotmBoys from './routes/bhotmBoys.js';
import adminRoutes from './routes/admin.js';
import gameRoutes from './routes/games.js';
import RandomMemeGeneratorModule from 'random-meme-generator';
const RandomMemeGenerator = RandomMemeGeneratorModule.default;

export default function setupRoutes(app, mongoose) {
    const bhothmGenerator = new RandomMemeGenerator(mongoose.connection, {
        textCollectionName: "bhothmText",
        textWildcardsAllowed: true,
        storeMemesInDB: true,
        templateCollectionName: "memeTemplate",
        templateWildcard: "*",
        textWildcard: "*",
        apiUrl: "https://api.memegen.link",
    });

    app.use(indexRoutes);
    app.use(rateRoutes);
    app.use(bhotmRoutes);
    app.use("/api/bhotm/month/", bhotmMonths);
    app.use("/api/bhotm/entry/", bhotmEntries);
    app.use("/api/bhotm/boy/", bhotmBoys);
    app.use("/api/bhothm", bhothmGenerator.express());
    app.use(authRoutes);
    app.use(adminRoutes);
    app.use(gameRoutes);
}