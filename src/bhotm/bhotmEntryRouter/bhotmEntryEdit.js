import React, { useState } from "react";
import EntryForm from "./bhotmEntryForm";
import { handleFetchErrors, showPageError } from "../../utils/helpers";
import { Redirect, useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../../utils/errorAlert";
import { updateEntry, getEntry } from "../api/bhotmEntryApi";
import { getBoys, checkAdmin } from "../api/userApi";

export default function EditPage() {
    const history = useHistory();
    const [result, setResult] = useState({
        loaded: false,
        failed: false,
        result: {},
    });

    const [toEdit, setEdit] = useState({
        loaded: false,
        failed: false,
        result: {},
    });

    const { entryId } = useParams();

    const [boys, setBoys] = useState([]);
    const [user, setUser] = useState();

    if (!user) {
        checkAdmin()
            .then((res) => {
                setUser(res);
                getBoys().then(setBoys);
            })
            .catch((err) => showPageError(err, history));
    }

    if (!toEdit.loaded && !toEdit.failed) {
        getEntry(entryId)
            .then((res) => {
                setEdit({
                    loaded: true,
                    failed: false,
                    result: res,
                });
            })
            .catch((error) => {
                setEdit({
                    loaded: false,
                    failed: true,
                    result: error,
                });
            });
    }

    if (result.loaded) {
        return <Redirect to={`/bhotm/entry/${result.result._id}`} />;
    } else if (toEdit.loaded) {
        return (
            <div className="container">
                <ErrorAlert error={result.failed ? result.result : null} />
                <h2 className="text-center my-2">Edit BHotM Entry</h2>
                <div className="col-md-8 mx-auto">
                    <EntryForm
                        initialValues={toEdit.result}
                        onSubmit={(data, { setSubmitting }) => {
                            setSubmitting(true);
                            console.log("wanna submit?");
                            updateEntry(data, entryId)
                                .then((res) => {
                                    setResult({
                                        loaded: true,
                                        failed: false,
                                        result: res,
                                    });
                                    setSubmitting(false);
                                })
                                .catch((error) => {
                                    setResult({
                                        loaded: false,
                                        failed: true,
                                        result: error,
                                    });
                                    setSubmitting(false);
                                });
                        }}
                        boys={boys.length > 1 ? boys : []}
                        showAdminFields={true}
                    />
                </div>
            </div>
        );
    } else {
        return null;
    }
}
