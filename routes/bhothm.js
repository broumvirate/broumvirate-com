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

        texts = await Promise.all(
            texts.map(async (textResult, i) => {
                let text = textResult.text;
                
                // Fill in wildcards.
                while (text.includes("*")) {
                    const innerText = await bhothmText.aggregate([
                        { $sample: { size: 1 } },
                    ]);
                    
                    text = text.replace(/\*/g, innerText[0].text);
                }
                
                // Place bhothmtext within meme-specific templates
                if (
                    meme.templates &&
                    meme.templates[i] &&
                    meme.templates[i] !== ""
                ) {
                    text = meme.templates[i].replace(/X/g, text);
                }

                // Replace special characters with api replacements
                text = text.replace(/_/g, "__");
                text = text.replace(/-/g, "--");
                text = text.replace(/ /g, "_");
                text = text.replace(/\?/g, "~q");
                text = text.replace(/#/g, "~h");
                text = text.replace(/&/g, "~a");
                text = text.replace(/%/g, "~p");
                
                return text;
            })
        );

        // Early method of only putting text on bottom.
        // Can cause problems/confusion with templates and should be refactored
        if (texts.length == 1 && meme.lines == 2) {
            texts = ["_", texts[0]];
        }

        // Specific feature for gru meme
        if (meme.repeatLast) {
            texts = texts.concat(texts[texts.length - 1]);
        }

        let urlSuffix = ".png";
        if (meme.urlSuffix) {
            urlSuffix = `.png?${meme.urlSuffix}`;
        }

        const memePath = texts.reduce((acc, next) => acc + "/" + next, "");

        const url = `${apiBase}/${meme.urlPrefix}${memePath}${urlSuffix}`;

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
