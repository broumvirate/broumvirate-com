import express from "express";
import bmHelpers from "../bmHelpers.js";
import Boy from "../models/boy.js";
import { bhotmEntry } from "../models/bhotm.js";

const router = express.Router();

router.get("/:id", function (req, res, next) {
    const find = {
        isDeleted: false,
        hasBeenJudged: true,
        boy: req.params.id,
        format: {$ne: "mason"}
    };


    bhotmEntry.find(find)
        .populate({path: 'month', options: {sort: [{'date': 'asc'}]}})
        //.sort({'month.date': 1})
        .then((data) => {
            if (req.isUnauthenticated()) {
                data = data.map((el) => {
                    if (el.requiresLogin) {
                        return bmHelpers.bhotm.setAsRestricted(el);
                    } else return el;
                });
            }

            Boy.findById(req.params.id)
            .then((boy) => {
                res.json({ boy: boy, submissions: data })
            })
            .catch((err) => {
                next([{ code: 400, title: "Unable to get boy", details: err }]);
                return 'sneffo'
            });
        })
        .catch((err) => {
            if(err !== 'sneffo')
            {
                next([{ code: 400, title: "Unable to get submissions", details: err }]);
            }
        })
});

export default router;