import React from "react";
import { Formik, Field, Form, useField, FieldArray } from "formik";
import Validators from "../../../validators/bhotm";
import bhotmEntry from "../shared/bhotmEntry";
import { BootstrapTextField } from "../shared/formikBootstrap";

export default function MonthForm(props) {
    return (
        <Formik
            initialValues={props.initialValues}
            onSubmit={props.onSubmit}
            validateOnChange={true}
            validationSchema={Validators.MonthValidator}
        >
            {({ values, isSubmitting, errors }) => (
                <Form>
                    {props.showAdminFields ? (
                        <div>
                            <BootstrapTextField
                                label="Month Title"
                                type="input"
                                name="month"
                            />
                            <BootstrapTextField
                                label="Notes"
                                type="input"
                                name="notes"
                            />
                            <BootstrapTextField
                                label="Judge"
                                type="input"
                                name="judge"
                            />
                        </div>
                    ) : null}
                    <div>
                        <FieldArray
                            name="places"
                            render={(arrayHelpers) => (
                                <div>
                                    {values.places
                                        .sort((a, b) => a.place - b.place)
                                        .map((el, i) => (
                                            <div
                                                className="d-flex justify-content-between"
                                                key={el.submission._id}
                                            >
                                                <p>
                                                    {el.submission.entryName} -{" "}
                                                    {el.submission.name}
                                                </p>
                                                <input
                                                    type="number"
                                                    onChange={(e) => {
                                                        arrayHelpers.replace(
                                                            i,
                                                            {
                                                                place:
                                                                    e.target
                                                                        .value,
                                                                submission:
                                                                    el.submission,
                                                            }
                                                        );
                                                    }}
                                                ></input>
                                            </div>
                                        ))}
                                </div>
                            )}
                        ></FieldArray>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            Judge Month
                        </button>

                        {props.showAdminFields ? (
                            <button
                                type="submit"
                                className="btn btn-secondary mx-2"
                                disabled={isSubmitting}
                            >
                                Save
                            </button>
                        ) : null}
                    </div>
                </Form>
            )}
        </Formik>
    );
}
