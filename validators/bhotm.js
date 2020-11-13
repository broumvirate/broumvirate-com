const { object, date, string, array, number, boolean } = require("yup");

const EntryValidator = object().shape({
    entryDate: date().default(() => {
        return new Date();
    }),
    name: string().min(1).required(),
    email: string().email().required(),
    entryName: string(),
    entryDescription: string(),
    boy: array().default([]),
    user: string(),
    month: string(),
    link: string().min(1).required(),
    format: string(),
    clickLink: string().url(),
    place: number().default(-1),
    bhotyPlace: number().default(-1),
    isWinner: boolean().default(false),
    hasBeenJudged: boolean().default(false),
    entryMethod: string().default("form"),
    edited: boolean().default(false),
    lastEditedDate: date(),
});

const MonthValidator = object().shape({
    month: string().default("Blank BHotM"),
    date: date().default(() => {
        return new Date();
    }),
    submissions: array().default([]),
    notes: string(),
    winner: string(),
    winnerRef: string(),
    judge: string(),
    hasBeenJudged: boolean().default(false),
    isBhoty: boolean().default(false),
});

module.exports = { EntryValidator, MonthValidator };
