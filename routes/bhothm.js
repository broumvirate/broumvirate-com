const express = require("express");
const router = express.Router();
const bmHelpers = require("../bmHelpers");

const { bhothmText, bhothmMeme } = require("../models/bhothm");

// bhothm meme generator

router.get("/", async function (req, res, next) {
    const apiBase = "https://api.memegen.link/images";

    try {
        const memes = await bhothmMeme.aggregate([{ $sample: { size: 1 } }]);
        const meme = memes[0];
        let texts = await bhothmText.aggregate([
            { $sample: { size: meme.textCount } },
        ]);

        texts = texts.map((textResult, i) => {
            let text = textResult.text;
            if(meme.templates && meme.templates[i] && meme.templates[i] !== "")
            {
                text = meme.templates[i].replace(/X/, text);
            }
            text = text.replace(/_/g, "__");
            text = text.replace(/-/g, "--");
            text = text.replace(/ /g, "_");
            text = text.replace(/\?/g, "~q");
            text = text.replace(/#/g, "~h");
            text = text.replace(/&/g, "~a");
            text = text.replace(/%/g, "~p");
            return text;
        });

        if (texts.length == 1 && meme.lines == 2) {
            texts = ["_", texts[0]];
        }

        if (meme.repeatLast) {
            texts = texts.concat(texts[texts.length - 1]);
        }

        let urlSuffix = ".png";
        if (meme.urlSuffix) {
            urlSuffix = `.png?${meme.urlSuffix}`;
        }

        let memePath = texts.reduce((acc, next) => acc + "/" + next, "");

        let url = `${apiBase}/${meme.urlPrefix}${memePath}${urlSuffix}`;

        res.json({ url });
    } catch (err) {
        next([{ code: 500, title: "Unable to generate meme", details: err }]);
    }
});

router.get("/text", async function (req, res, next) {
    try {
        const text = await bhothmText.find();
        res.json(text.map((el) => el.text));
    } catch (err) {
        next([{ code: 500, title: "Unable to generate meme", details: err }]);
    }
});

router.post("/", async function (req, res, next) {
    try {
        const text = req.body.text;
        let result = await bhothmText.create({ text });
        res.json(result);
    } catch (err) {
        next([{ code: 500, title: "Unable to add Bhothmtext", details: err }]);
    }
});

module.exports = router;
