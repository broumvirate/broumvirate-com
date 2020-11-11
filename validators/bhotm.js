const {
    object,
    number,
    string,
    array,
    date,
    optional,
    boolean,
    defaulted,
} = require("superstruct");

const EntryValidator = object({
    entryDate: defaulted(date(), () => {
        const d = new Date();
        return d;
    }),
    name: string(),
    email: optional(string()),
    entryName: optional(string()),
    entryDescription: optional(string()),
    boy: defaulted(array(), []),
    user: optional(string()),
    month: optional(string()),
    link: string(),
    format: optional(string()),
    clickLink: optional(string()),
    place: defaulted(number(), -1),
    bhotyPlace: defaulted(number(), -1),
    isWinner: defaulted(boolean(), false),
    hasBeenJudged: defaulted(boolean(), false),
    entryMethod: defaulted(string(), "form"),
    edited: defaulted(boolean(), false),
    lastEditedDate: optional(date()),
});

const MonthValidator = object({
    month: string(),
    date: defaulted(date(), () => {
        const d = new Date();
        return d;
    }),
    submissions: array(),
    notes: optional(string()),
    winner: optional(string()),
    winnerRef: optional(string()),
    judge: optional(string()),
    hasBeenJudged: defaulted(boolean(), false),
    isBhoty: defaulted(boolean(), false),
});

module.exports = { EntryValidator, MonthValidator };
