import React, { useState } from "react";
import EntryForm from "./bhotmEntryForm.js";
import { handleFetchErrors, showPageError } from "../helpers/helpers.js";
import { Redirect } from "react-router-dom";
import ErrorAlert from "./errorHandling/errorAlert.js";
import { newEntry, getBoys, checkAuth } from "../apiCalls/bhotmEntryApi.js";

export default function NewPage() {
    const [result, setResult] = useState({
        loaded: false,
        failed: false,
        result: {},
    });

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

    if (result.loaded) {
        return <Redirect to={`/bhotm/entry/${result.result._id}`} />;
    }
    return (
        <div className="container">
            <ErrorAlert error={result.failed ? result.result : null} />
            <h2 className="text-center my-2">New BHotM Entry</h2>
            <div className="col-md-8 mx-auto">
                <EntryForm
                    initialValues={{
                        name: "",
                        email: "",
                        entryName: "",
                        entryDescription: "",
                        link: "",
                        clickLink: "",
                        boy: [],
                    }}
                    onSubmit={(data, { setSubmitting }) => {
                        setSubmitting(true);
                        newEntry(data)
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
                    showAdminFields={user ? user.isAdmin : false}
                />
            </div>
        </div>
    );
}
