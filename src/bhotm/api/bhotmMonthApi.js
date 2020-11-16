import { handleFetchErrors } from "../../utils/helpers";

const getMonths = () => {
    return fetch("/api/bhotm/month").then(handleFetchErrors);
};

const getMonth = (id) => {
    return fetch("/api/bhotm/month/" + id).then(handleFetchErrors);
};

const newMonthType = (type) => {
    return fetch("/api/bhotm/month", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ type }),
    }).then(handleFetchErrors);
};

const newMonth = (month) => {
    return fetch("/api/bhotm/month", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ month }),
    }).then(handleFetchErrors);
};

export { getMonths, getMonth, newMonthType, newMonth };
