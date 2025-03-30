import React, { useState } from "react";
import EntryForm from "./bhotmEntryForm";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { showPageError, showAlert } from "../../utils/helpers";
import { newEntry } from "../api/bhotmEntryApi";
import { getBoys, checkAuth } from "../api/userApi";

export default function NewPage() {
    const history = useHistory();
    const search = useLocation().search;
    const query = new URLSearchParams(search);
    const [result, setResult] = useState(null);
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

    if (result !== null) {
        return <Redirect to={`/bhotm/entry/${result._id}`} />;
    } else {
        return (
            <div className="container">
                <h2 className="text-center my-2">New BHotM Entry</h2>
                <div className="col-md-8 mx-auto">
                    <EntryForm
                        initialValues={{
                            name: "",
                            email: "",
                            entryName: "",
                            entryDescription: "",
                            link: query.has("link") ? query.get("link") : "",
                            clickLink: "",
                            boy: [],
                        }}
                        onSubmit={(data, { setSubmitting }) => {
                            setSubmitting(true);
                            newEntry(data)
                                .then((res) => {
                                    setSubmitting(false);
                                    setResult(res);
                                })
                                .catch((error) => {
                                    setSubmitting(false);
                                    showAlert(error, history);
                                });
                        }}
                        boys={boys}
                        showAdminFields={user ? user.isAdmin : false}
                    />
                </div>
            </div>
        );
    }
}
