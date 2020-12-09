const { TestScheduler } = require("jest");
const bhotm = require("../bmHelpers.js").bhotm;

describe("bhotm helper functions", () => {
    test("correctly picks entry type from link", () => {
        expect(
            bhotm.getEntryType("https://i.imgur.com/3kcNfaq.jpg").format
        ).toBe("image");

        expect(
            bhotm.getEntryType("https://i.imgur.com/DvCWAPD.GIF").format
        ).toBe("image");

        expect(bhotm.getEntryType("").format).toBe("mason");

        expect(
            bhotm.getEntryType("https://i.imgur.com/DvCWAPD.mp3").format
        ).toBe("audio");

        expect(() => bhotm.getEntryType(null).format).toThrow();

        expect(
            bhotm.getEntryType("https://www.youtube.com/watch?v=EMGa53miavE")
        ).toEqual({
            format: "youtube",
            link: "https://www.youtube.com/embed/EMGa53miavE",
        });

        expect(bhotm.getEntryType("https://youtu.be/EMGa53miavE")).toEqual({
            format: "youtube",
            link: "https://www.youtube.com/embed/EMGa53miavE",
        });
    });

    test("bhotm due dates exist and are vaguely correct", () => {
        expect(bhotm.dueMoment().date()).toBe(5);
        expect(bhotm.dueMoment(true).date()).toBe(5);
    });
});
