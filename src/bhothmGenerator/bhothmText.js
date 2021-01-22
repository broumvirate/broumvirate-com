import React from "react";
import { Formik, Form } from "formik";
import { BootstrapTextField } from "../bhotm/shared/formikBootstrap";
import { handleFetchErrors, showAlert } from "../utils/helpers";
import { Link, useHistory } from "react-router-dom";

const AddBhothmText = () => {
    const history = useHistory();
    return (
        <div className="container mt-2">
            <h3 className="text-center">Add Bhothmtext</h3>
            <div className="col-md-8 mx-auto">
                <Formik
                    initialValues={{ text: "" }}
                    onSubmit={(data, { setSubmitting, resetForm }) => {
                        setSubmitting(true);
                        addText(data.text)
                            .then((res) => {
                                setSubmitting(false);
                                resetForm();
                                showAlert(
                                    {
                                        success: true,
                                        message: `"${data.text}" added to BhothmText`,
                                    },
                                    history
                                );
                            })
                            .catch((err) => {
                                setSubmitting(false);
                                showAlert(err, history);
                            });
                    }}
                >
                    {({ values, isSubmitting, errors }) => (
                        <Form>
                            <BootstrapTextField
                                label="New Bhothmtext"
                                type="input"
                                name="text"
                            />

                            <div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    Submit
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <p className="my-3">
                <Link to={"/bhotm/bhothm-generator"}>
                    Back to BHOTHM Generator
                </Link>
                <div>
                    <a href="/api/bhothm/text">See All Bhothmtext</a>
                </div>
            </p>
        </div>
    );
};

const addText = (text) => {
    let url = "/api/bhothm";
    return fetch(url, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ text }),
    }).then(handleFetchErrors);
};

export default AddBhothmText;
