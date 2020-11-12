const handleFetchErrors = (res) => {
    if (!res.ok) {
        return res.json().then((data) => {
            if (res.status === 403) {
                throw {
                    errorMessage: "Forbidden",
                    errors: data.errors,
                    status: res.status,
                };
            } else if (res.status >= 400 && res.status < 500) {
                throw {
                    errorMessage: "Error with request",
                    errors: data.errors,
                    status: res.status,
                };
            } else {
                throw {
                    errorMessage: "Server is not responding",
                    errors: data.errors,
                    status: res.status,
                };
            }
        });
    } else {
        return res.json();
    }
};

const showPageError = (error, history) => {
    history.replace(history.location.pathname, {
        errorStatusCode: error.status,
        errorMessage: error.errorMessage,
        errorDetails: error.errors,
    });
};

export { handleFetchErrors, showPageError };

export const checkAuth = () => {
    const url = "/api/user/authenticated";
    return fetch(url)
        .then(handleFetchErrors)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return { error: err };
        });
};
