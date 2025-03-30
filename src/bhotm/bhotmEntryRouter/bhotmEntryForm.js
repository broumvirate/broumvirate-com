import React from "react";
import { Formik, Field, Form } from "formik";
import Validators from "../../../validators/bhotm";
import { getBhotmLinkType } from "../../utils/helpers";
import { BootstrapTextField } from "../shared/formikBootstrap";

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

function BoyCheckboxes(boys) {
    return boys.boys.map((el, i) => (
        <div className="form-check form-check-inline" key={el._id}>
            <Field
                type="checkbox"
                name="boy"
                value={String(el._id)}
                className="form-check-input"
            ></Field>
            <label className="form-check-label">
                {el.name} {el.lastName}
            </label>
        </div>
    ));
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
                    {props.showAdminFields ? (
                        <div>
                            <BootstrapTextField
                                name="clickLink"
                                type="input"
                                label="Click Link"
                                helper="The full link to the entry. Use the normal link for a preview image"
                            />

                            <div className="form-check form-check-inline">
                            <Field
                                type="checkbox"
                                name="requiresLogin"
                                className="form-check-input"
                            ></Field>
                            <label className="form-check-label">
                                NSFW Submission (Requires Login)
                            </label>
                            </div>


                            <div className="my-3">
                                <p>
                                    <strong>Attached Users:</strong>
                                </p>
                                <BoyCheckboxes boys={props.boys} />
                            </div>
                        </div>
                    ) : null}

                    <div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            Submit BHotM
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
