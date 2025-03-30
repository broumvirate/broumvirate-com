import React, { useState } from "react";
import EntryForm from "./bhotmEntryForm";
import { showPageError, showAlert } from "../../utils/helpers";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { updateEntry, getEntry } from "../api/bhotmEntryApi";
import { getBoys, checkAdmin } from "../api/userApi";

export default function EditPage() {
    const { entryId } = useParams();
    const history = useHistory();

    const [boys, setBoys] = useState([]);
    const [entry, setEntry] = useState(null);
    const [editResult, setEditResult] = useState(null);
    const [user, setUser] = useState();

    if (!user) {
        checkAdmin()
            .then((res) => {
                setUser(res);
                getBoys().then(setBoys);
                return getEntry(entryId).then((res) => setEntry(res));
            })
            .catch((err) => showPageError(err, history));
    }

    if (editResult !== null) {
        return <Redirect to={`/bhotm/entry/${editResult._id}`} />;
    } else if (entry !== null) {
        return (
            <div className="container">
                <h2 className="text-center my-2">Edit BHotM Entry</h2>
                <div className="col-md-8 mx-auto">
                    <EntryForm
                        initialValues={entry}
                        onSubmit={(data, { setSubmitting }) => {
                            setSubmitting(true);
                            updateEntry(data, entryId)
                                .then((res) => {
                                    setSubmitting(false);
                                    setEditResult(res);
                                })
                                .catch((error) => {
                                    setSubmitting(false);
                                    showAlert(error, history);
                                });
                        }}
                        boys={boys}
                        showAdminFields
                    />
                </div>
            </div>
        );
    } else {
        return null;
    }
}
