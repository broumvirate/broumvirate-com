import React from "react";
import { Formik, Field, Form, useField } from "formik";
import Validators from "../../validators/bhotm.js";
import { getBhotmLinkType } from "../helpers/helpers.js";

function BootstrapTextField(props) {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return (
        <div className="form-group">
            <label htmlFor={props.name}>
                <strong>{props.label}:</strong>
            </label>
            <input
                id={field.name}
                type={props.fieldType ? props.fieldType : "text"}
                {...field}
                className={
                    errorText === ""
                        ? "form-control"
                        : "form-control is-invalid"
                }
            />
            <div className="invalid-feedback">
                {errorText.slice(0, 1).toUpperCase() + errorText.slice(1)}
            </div>
            {props.helper ? (
                <small className="form-text text-muted">{props.helper}</small>
            ) : null}
            {props.children}
        </div>
    );
}
function DetectLink(props) {
    if (props.link) {
        const newLink = new String(props.link);
        return (
            <small className="form-text text-muted">
                Submission detected as a:{" "}
                <strong>{getBhotmLinkType(newLink)}</strong>
            </small>
        );
    }
    return null;
}

export default function EntryForm(props) {
    return (
        <Formik
            initialValues={props.initialValues}
            onSubmit={props.onSubmit}
            validateOnChange={true}
            validationSchema={Validators.EntryValidator}
        >
            {({ values, isSubmitting, errors }) => (
                <Form>
                    <BootstrapTextField
                        label="Your Name"
                        type="input"
                        name="name"
                    />
                    <BootstrapTextField
                        name="email"
                        type="input"
                        label="Email Address"
                    />
                    <BootstrapTextField
                        name="link"
                        type="input"
                        label="Submission Link"
                        helper="Please host videos on Youtube and images elsewhere. Direct image upload is in development."
                    >
                        <DetectLink link={values.link} />{" "}
                    </BootstrapTextField>
                    <BootstrapTextField
                        name="entryName"
                        type="input"
                        label="Title of Submission"
                        helper="Optional"
                    />
                    <BootstrapTextField
                        name="entryDescription"
                        type="input"
                        label="Description"
                        helper="Optional"
                    />

                    <div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            Submit BHotM
                        </button>
                    </div>
                    <pre>{JSON.stringify(values, null, 2)}</pre>
                    <pre>{JSON.stringify(errors, null, 2)}</pre>
                </Form>
            )}
        </Formik>
    );
}
