import { handleFetchErrors, showPageError } from "../../utils/helpers";

const checkAuth = () => {
    const url = "/api/user/authenticated";
    return fetch(url, {
        headers: new Headers({
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
            Expires: 0,
        }),
    })
        .then(handleFetchErrors)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return { error };
        });
};

const checkAdmin = () => {
    return checkAuth().then((res) => {
        if (res.error) {
            throw res.error;
        }
        if (res.isAdmin) {
            return res;
        } else {
            throw { code: 403, errorMessage: "Forbidden" };
        }

        throw { code: 400, errorMessage: "Unable to check auth" };
    });
};

const getBoys = () => {
    return fetch("/api/boys").then(handleFetchErrors);
};

export { getBoys, checkAuth, checkAdmin };
