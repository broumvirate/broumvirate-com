import React from "react";
import { Formik, Field, Form, useField } from "formik";
import Validators from "../../validators/bhotm.js";
import {
    getBhotmLinkType,
    formikSuperstructValidate,
} from "../helpers/helpers.js";

function MyTextField(props) {
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
                className="form-control"
            />
            {props.helper ? (
                <small className="form-text text-muted">{props.helper}</small>
            ) : null}
        </div>
    );
}

function MyTextArea(props) {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return (
        <div className="form-group">
            <label htmlFor={props.name}>
                <strong>{props.label}:</strong>
            </label>
            <textarea
                id={field.name}
                type="text"
                {...field}
                className="form-control"
            />
            {props.helper ? (
                <small className="form-text text-muted">{props.helper}</small>
            ) : null}
        </div>
    );
}

function DetectLink(props) {
    if (props.link) {
        const newLink = new String(props.link);
        return (
            <span className="mb-2">
                Submission detected as a: {getBhotmLinkType(newLink)}
            </span>
        );
    }
    return null;
}

export default function EntryForm(props) {
    return (
        <Formik
            initialValues={props.initialValues}
            onSubmit={props.onSubmit}
            validate={(data) =>
                formikSuperstructValidate(data, Validators.EntryValidator)
            }
        >
            {({ values, isSubmitting }) => (
                <Form>
                    <MyTextField label="Your Name" type="input" name="name" />
                    <MyTextField
                        name="email"
                        type="input"
                        fieldType="email"
                        label="Email Address"
                    />
                    <DetectLink link={values.link} />
                    <MyTextField
                        name="link"
                        type="input"
                        label="Submission Link"
                        helper="Please host videos on Youtube and images elsewhere. Direct image upload is in development."
                    />
                    <MyTextField
                        name="entryName"
                        type="input"
                        label="Title of Submission"
                        helper="Optional"
                    />
                    <MyTextArea
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
                    <pre>{JSON.stringify(values, {}, 2)}</pre>
                </Form>
            )}
        </Formik>
    );
}
