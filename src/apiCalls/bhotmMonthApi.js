import { handleFetchErrors } from "../helpers/helpers.js";

const getMonths = () => {
    return fetch("/api/bhotm/month").then(handleFetchErrors);
};

const getMonth = (id) => {
    return fetch("/api/bhotm/month/" + id).then(handleFetchErrors);
};

export { getMonths, getMonth };
