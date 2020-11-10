export const checkAuth = () => {
    const url = "/api/user/authenticated";
    return fetch(url)
        .then((res) => res.json())
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return { error: err };
        });
};
