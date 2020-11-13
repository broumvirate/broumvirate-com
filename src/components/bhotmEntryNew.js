import React from "react";
import EntryForm from "./bhotmEntryForm.js";

export default function NewPage() {
    return (
        <div className="container">
            <h2 className="text-center my-2">New BHotM Entry</h2>
            <div className="col-md-8 mx-auto">
                <EntryForm
                    initialValues={{
                        name: "undefined",
                        email: "",
                        entryName: 1,
                        entryDescription: "",
                        link: 2,
                        clickLink: "",
                    }}
                    onSubmit={(data, { setSubmitting }) => {
                        setSubmitting(true);
                        // ajax request
                        console.log("submit:", data);
                        setSubmitting(false);
                    }}
                />
            </div>
        </div>
    );
}
