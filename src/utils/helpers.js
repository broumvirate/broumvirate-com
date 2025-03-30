const handleFetchErrors = (res) => {
    if (!res.ok) {
        return res.json().then((data) => {
            if (res.status === 403) {
                throw {
                    errorMessage: "Forbidden",
                    errors: data.errors,
                    code: res.status,
                };
            } else if (res.status >= 400 && res.status < 500) {
                throw {
                    errorMessage: `Error: ${data.errors[0].title}`,
                    errors: data.errors,
                    code: res.status,
                };
            } else {
                throw {
                    errorMessage: `Server is not responding`,
                    errors: data.errors,
                    code: res.status,
                };
            }
        });
    } else {
        return res.json();
    }
};

// TODO: Make these two functions work without passing in a history object
// createBrowserHistory() directly from the history package doesn't trigger a react re-render for whatever reason
// I suspect a custom hook would be best but not having a lot of luck

const showPageError = (error, history) => {
    history.replace(history.location.pathname, {
        error,
    });
};

const showAlert = (alert, history) => {
    history.replace(history.location.pathname, {
        alert,
    });
};

const getBhotmLinkType = (link) => {
    //Using a link, determine the entry type. Return object, format and link.
    const imgExtensions = ["jpg", "jpeg", "png", "gif"];
    const audioExtensions = ["mp3", "wav"];
    const videoExtensions = ["mp4", "mov"];
    let splitLink = link.split(".");
    let fileExtension = splitLink[splitLink.length - 1].toLowerCase();
    let format = "Link";

    if (link == "") {
        //No link means ur mason
        format = "Mason";
    } else if (link.includes("youtube.com") || link.includes("youtu.be")) {
        //If the link is youtube, convert it to an embed format
        format = "Youtube Video";
    } else if (imgExtensions.includes(fileExtension)) {
        format = "Image";
    } else if (audioExtensions.includes(fileExtension)) {
        format = "Audio";
    } else if (videoExtensions.includes(fileExtension)) {
        format = "Video File";
    } else if (link.includes(" ")) {
        // If the link has a space, it's a phrase
        format = "Phrase";
    }

    return format;
};

export { handleFetchErrors, showPageError, getBhotmLinkType, showAlert };
