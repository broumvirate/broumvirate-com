import { handleFetchErrors } from "../../utils/helpers";

const getEntries = ({ unjudged }) => {
    let url = "/api/bhotm/entry";
    if (unjudged) {
        url = "/api/bhotm/entry?filter=unjudged";
    }
    return fetch(url).then(handleFetchErrors);
};

const getEntry = (id) => {
    return fetch("/api/bhotm/entry/" + id).then(handleFetchErrors);
};

const newEntry = (data) => {
    return fetch("/api/bhotm/entry/", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ entry: data }),
    }).then(handleFetchErrors);
};

const newMasonEntry = () => {
    return fetch("/api/bhotm/entry/", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({entry: {name: "Mason", link: "", format: "mason"}}),
    }).then(handleFetchErrors);
}

const updateEntry = (data, id) => {
    return fetch(`/api/bhotm/entry/${id}`, {
        method: "PUT",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ entry: data }),
    }).then(handleFetchErrors);
};

const getBoyEntries = (id) => {
    return fetch("/api/bhotm/boy/" + id).then(handleFetchErrors);
}

export { getEntry, getEntries, newEntry, newMasonEntry, updateEntry, getBoyEntries };
