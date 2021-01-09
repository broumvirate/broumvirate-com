import BhotmEntry from "../shared/bhotmEntry";
import EditDeleteButtons from "../shared/editDeleteButtons";
import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { showPageError } from "../../utils/helpers";
import { getEntry } from "../api/bhotmEntryApi";

const EntryPage = () => {
    const match = useRouteMatch();
    const history = useHistory();
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        getEntry(match.params.entryId)
            .then((entry) => setEntry({ ...entry }))
            .catch((error) => {
                showPageError(error, history);
            });
    }, [match.params.entryId]);

    if (entry !== null) {
        document.title = `${entry.name}'s BHotM Submission - The Broumvirate`;
        return (
            <div className="container mt-4">
                <BhotmEntry
                    entry={entry}
                    unjudged={!entry.hasBeenJudged}
                    linkToMonth={entry.month !== undefined}
                />
                <EditDeleteButtons
                    context="Entry"
                    editEndpoint={`/bhotm/entry/${entry._id}/edit`}
                    deleteEndpoint={`/api/bhotm/entry/${entry._id}`}
                    redirect="/bhotm/admin"
                />
            </div>
        );
    } else {
        return <div className="container mt-4"></div>;
    }
};

export default EntryPage;
