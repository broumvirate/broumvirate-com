import React, { useState } from "react";
import MonthForm from "./bhotmMonthForm";
import { showPageError } from "../../utils/helpers";
import { Redirect, useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../../utils/errorAlert";
import { getEntries, checkAuth } from "../api/bhotmEntryApi";
import { getMonth, updateMonth } from "../api/bhotmMonthApi";

export default function MonthEditPage() {
    const { monthId } = useParams();
    const history = useHistory();

    const [month, setMonth] = useState({
        loaded: false,
        failed: false,
        result: {},
    });
    const [entries, setEntries] = useState({
        loaded: false,
        failed: false,
        result: {},
    });
    const [editResult, setEditResult] = useState({
        loaded: false,
        failed: false,
        result: {},
    });
    const [user, setUser] = useState();

    if (!user) {
        // Check auth first
        checkAuth().then((res) => {
            setUser(res);
            if (res.isAdmin) {
                getMonth(monthId) // Get month and entries, store in state. Go immediately to 400 error if no worky.
                    .then((month) => setMonth({ loaded: true, result: month }))
                    .then(() => getEntries(false))
                    .then((entries) =>
                        setEntries({ loaded: true, result: entries })
                    )
                    .catch((err) => {
                        showPageError(err, history);
                    });
            } else {
                // Show 403 if not authorized
                showPageError(
                    { code: 403, errorMessage: "Forbidden" },
                    history
                );
            }
        });
    }

    if (editResult.loaded) {
        return <Redirect to={`/bhotm/month/${monthId}`} />;
    } else if (month.loaded) {
        return (
            <div className="container">
                <ErrorAlert
                    error={editResult.failed ? editResult.result : null}
                />
                <h2 className="text-center my-2">Edit BHotM</h2>
                <div className="col-md-8 mx-auto">
                    <MonthForm
                        initialValues={month.result}
                        showAdminFields={user.isAdmin}
                        onSubmit={(data, { setSubmitting }) => {
                            setSubmitting(true);
                            updateMonth(data, monthId, {
                                judged: false,
                                changedOrder: false,
                            })
                                .then((res) => {
                                    setEditResult({
                                        loaded: true,
                                        failed: false,
                                        result: res,
                                    });
                                    setSubmitting(false);
                                })
                                .catch((error) => {
                                    setEditResult({
                                        loaded: false,
                                        failed: true,
                                        result: error,
                                    });
                                    setSubmitting(false);
                                });
                        }}
                        entries={entries.loaded ? entries.result : []}
                    />
                </div>
            </div>
        );
    } else {
        return null;
    }
}
