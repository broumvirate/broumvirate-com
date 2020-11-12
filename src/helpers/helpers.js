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

export { handleFetchErrors, showPageError, checkAuth };
