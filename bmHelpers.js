var express = require("express");
var dayjs = require("dayjs");

module.exports = {
    discordTags: {
        4172: "5dfa4993ae42c901a49dc6e8", //Ben
        4269: "5dfa4993ae42c901a49dc6ea", //Jacob
        3529: "5dfa4993ae42c901a49dc6e9", //Alden
        4380: "5dfa4993ae42c901a49dc6ec", //Kai
        5591: "5dfa4993ae42c901a49dc6eb", //Emerson
        8067: "5dfa4993ae42c901a49dc6ee", //Miles
    },

    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login?redirect=" + encodeURIComponent(req.url));
    },

    isAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                return next();
            } else {
                res.redirect("/bhotm");
            }
        }
        res.redirect("/login?redirect=" + encodeURIComponent(req.url));
    },

    bhotm: {
        getEntryType: function (link) {
            //Using a link, determine the entry type. Return object, format and link.
            const imgExtensions = ["jpg", "jpeg", "png", "gif"];
            const audioExtensions = ["mp3", "wav"];
            let splitLink = link.split(".");
            let format = "link";
            let returnLink = link;

            if (link == "") {
                //No link means ur mason
                format = "mason";
            } else if (link.includes("youtube.com")) {
                //If the link is youtube, convert it to an embed format
                format = "youtube";
                returnLink = link.replace("watch?v=", "embed/");
            } else if (
                imgExtensions.includes(
                    splitLink[splitLink.length - 1].toLowerCase()
                )
            ) {
                // If the last element of the link (. delimited) is in the extension list
                format = "image";
            } else if (
                audioExtensions.includes(
                    splitLink[splitLink.length - 1].toLowerCase()
                )
            ) {
                // If the last element of the link (. delimited) is in the extension list
                format = "audio";
            } else if (link.includes(" ")) {
                // If the link has a space, it's a phrase
                format = "phrase";
            }

            return {
                format: format,
                link: returnLink,
            };
        },

        processMonth: function (month) {
            //Process a bhotm month from a form, sort the entries, set winner flags and entry formats
            for (i = 0; i < month.entries.length; i++) {
                //If no linked boy, replace the "" with undefined
                if (month.entries[i].boy == "") {
                    month.entries[i].boy = undefined;
                }

                ////////////////////
                // Determine format
                ////////////////////
                let processedEntry = this.getEntryType(month.entries[i].link);
                month.entries[i].format = processedEntry.format;
                month.entries[i].link = processedEntry.link;
            }

            month.entries.sort((a, b) =>
                parseInt(a.place) > parseInt(b.place) ? 1 : -1
            ); //Sort entries by place

            month.entries[0].isWinner = true; //Set winner flags
            month.winner = month.entries[0].name;

            return month;
        },

        dueMoment: function (incJ) {
            //Returns next due date moment
            //Params: incJ:boolean. include judging period. If true, due date doesn't roll over until the 8th. if false or empty, rolls over on 5th.
            let day = 4;
            dueDate = dayjs();

            if (incJ) {
                day = 7;
            }
            if (dayjs().date() > day) {
                //if it's after the 4th, add a month and set submission time
                dueDate = dueDate.add(1, "M").date(5).startOf("day");
            } else {
                //if it's before the 4th, its this month
                dueDate = dueDate.date(5).startOf("day");
            }
            return dueDate;
        },

        judgeMoment: function () {
            //Returns next moment when judging has ended
            return this.dueMoment(true).add(3, "d");
        },

        currentMonth: function () {
            //Returns format of the current month entries fall in
            return this.dueMoment(true).format("MMM. YYYY");
        },

        canSubmit: function () {
            //Returns true if we are not in the judging period
            return !dayjs().isAfter(this.dueMoment(true));
        },
    },
};
