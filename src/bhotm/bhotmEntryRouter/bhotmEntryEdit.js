import React, { useState } from "react";
import EntryForm from "./bhotmEntryForm";
import { handleFetchErrors, showPageError } from "../../utils/helpers";
import { Redirect, useLocation, useParams } from "react-router-dom";
import ErrorAlert from "../../utils/errorAlert";
import {
    updateEntry,
    getEntry,
    getBoys,
    checkAuth,
} from "../api/bhotmEntryApi";

export default function EditPage() {
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
        checkAuth().then((res) => {
            setUser(res);
            if (res.isAdmin) {
                getBoys().then(setBoys);
            }
        });
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
