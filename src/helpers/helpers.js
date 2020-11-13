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

const showPageError = (error, history) => {
    console.log(error);
    history.replace(history.location.pathname, {
        error,
    });
};

const checkAuth = () => {
    const url = "/api/user/authenticated";
    return fetch(url)
        .then(handleFetchErrors)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return { error };
        });
};

const getBhotmLinkType = (link) => {
    //Using a link, determine the entry type. Return object, format and link.
    const imgExtensions = ["jpg", "jpeg", "png", "gif"];
    const audioExtensions = ["mp3", "wav"];
    let splitLink = link.split(".");
    let format = "Link";

    if (link == "") {
        //No link means ur mason
        format = "Mason";
    } else if (link.includes("youtube.com") || link.includes("youtu.be")) {
        //If the link is youtube, convert it to an embed format
        format = "Youtube Video";
    } else if (
        imgExtensions.includes(splitLink[splitLink.length - 1].toLowerCase())
    ) {
        // If the last element of the link (. delimited) is in the extension list
        format = "Image";
    } else if (
        audioExtensions.includes(splitLink[splitLink.length - 1].toLowerCase())
    ) {
        // If the last element of the link (. delimited) is in the extension list
        format = "Audio";
    } else if (link.includes(" ")) {
        // If the link has a space, it's a phrase
        format = "Phrase";
    }

    return format;
};

export { handleFetchErrors, showPageError, checkAuth, getBhotmLinkType };
