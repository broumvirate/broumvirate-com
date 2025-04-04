const { object, date, string, array, number, boolean } = require("yup");

const EntryValidator = object().shape({
    entryDate: date().default(() => {
        return new Date();
    }),
    name: string().min(1).required(),
    email: string().email(),
    entryName: string(),
    entryDescription: string(),
    boy: array().default([]),
    user: string(),
    month: string(),
    format: string(),
    link: string().when("format", {
        is: "mason",
        then: (schema) => schema,
        otherwise: (schema) => schema.min(1).required()
    }),
    clickLink: string().url(),
    place: number().default(-1),
    bhotyPlace: number().default(-1),
    isWinner: boolean().default(false),
    hasBeenJudged: boolean().default(false),
    entryMethod: string().default("form"),
    edited: boolean().default(false),
    lastEditedDate: date(),
    requiresLogin: boolean().default(false),
});

const MonthValidator = object().shape({
    month: string().required(),
    date: date().default(() => {
        return new Date();
    }),
    submissions: array().default([]),
    places: array(),
    notes: string(),
    winner: string(),
    winnerRef: string(),
    judge: string(),
    hasBeenJudged: boolean().default(false),
    isBhoty: boolean().default(false),
});

module.exports = { EntryValidator, MonthValidator };
