import React, { useState } from "react";
import EntryForm from "./bhotmEntryForm.js";
import { handleFetchErrors, showPageError } from "../helpers/helpers.js";
import { Redirect } from "react-router-dom";
import ErrorAlert from "./errorHandling/errorAlert.js";

export default function NewPage() {
    const [result, setResult] = useState({
        loaded: false,
        failed: false,
        result: {},
    });
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
                    }}
                    onSubmit={(data, { setSubmitting }) => {
                        setSubmitting(true);
                        fetch("/api/bhotm/entry/", {
                            method: "POST",
                            headers: new Headers({
                                "Content-Type": "application/json",
                            }),
                            body: JSON.stringify({ entry: data }),
                        })
                            .then(handleFetchErrors)
                            .then((res) => {
                                setResult({
                                    loaded: true,
                                    failed: false,
                                    result: res,
                                });
                            })
                            .catch((error) => {
                                setResult({
                                    loaded: false,
                                    failed: true,
                                    result: error,
                                });
                            });
                        console.log({
                            method: "POST",
                            body: { entry: data },
                        });
                        setSubmitting(false);
                    }}
                />
            </div>
        </div>
    );
}
