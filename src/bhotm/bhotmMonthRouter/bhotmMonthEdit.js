import React, { useState } from "react";
import MonthForm from "./bhotmMonthForm";
import { showPageError, showAlert } from "../../utils/helpers";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { getEntries } from "../api/bhotmEntryApi";
import { getMonth, updateMonth } from "../api/bhotmMonthApi";
import { checkAdmin } from "../api/userApi";

export default function MonthEditPage() {
    const { monthId } = useParams();
    const history = useHistory();

    const [month, setMonth] = useState(null);
    const [entries, setEntries] = useState([]);
    const [editResult, setEditResult] = useState(null);
    const [user, setUser] = useState();

    if (!user) {
        // Check auth first
        checkAdmin()
            .then((res) => {
                setUser(res);
                return getMonth(monthId); // Get month and entries, store in state. Go immediately to 400 error if no worky.
            })
            .then((month) => setMonth(month))
            .then(() => getEntries({ unjudged: false }))
            .then((entries) => setEntries(entries))
            .catch((err) => {
                showPageError(err, history);
            });
    }

    if (editResult !== null) {
        return <Redirect to={`/bhotm/month/${monthId}`} />;
    } else if (month !== null) {
        return (
            <div className="container">
                <h2 className="text-center my-2">Edit BHotM</h2>
                <div className="col-md-8 mx-auto">
                    <MonthForm
                        initialValues={{
                            ...month,
                            places: month.submissions.map((el, i) => ({
                                place: i,
                                submission: el,
                            })),
                        }}
                        showAdminFields={user.isAdmin}
                        onSubmit={(data, { setSubmitting }) => {
                            setSubmitting(true);
                            updateMonth(data, monthId, {
                                judged: true,
                                changedOrder:
                                    data.places.map((el) => el.submission) !==
                                    month.submissions,
                            })
                                .then((res) => {
                                    setSubmitting(false);
                                    setEditResult(res);
                                })
                                .catch((error) => {
                                    setSubmitting(false);
                                    showAlert(error, history);
                                });
                        }}
                        entries={entries !== null ? entries : []}
                    />
                </div>
            </div>
        );
    } else {
        return null;
    }
}
