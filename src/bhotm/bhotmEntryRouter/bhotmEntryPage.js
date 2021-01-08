import BhotmEntry from "../shared/bhotmEntry";
import EditDeleteButtons from "../shared/editDeleteButtons";
import React, { useState, useEffect } from "react";
import { showPageError } from "../../utils/helpers";
import { getEntry } from "../api/bhotmEntryApi";

const EntryPage = (props) => {
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        getEntry(props.match.params.entryId)
            .then((entry) => setEntry({ ...entry }))
            .catch((error) => {
                showPageError(error);
            });
    }, [props.match.params.entryId]);

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
