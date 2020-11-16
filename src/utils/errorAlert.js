import React from "react";

const ErrorAlert = (props) =>
    props.error ? (
        <div className="alert alert-danger" role="alert">
            Error Code {props.error.code} - {props.error.errorMessage}
        </div>
    ) : null;

export default ErrorAlert;
