import React from "react";

const BMAlert = (props) => {
    if (props.alert) {
        return (
            <div className="container">
                {props.alert.success ? (
                    <BMAlertSuccess {...props} />
                ) : (
                    <BMAlertDanger {...props} />
                )}
            </div>
        );
    } else return null;
};

const BMAlertDanger = (props) => (
    <div className="alert alert-danger" role="alert" onClick={props.close}>
        Error Code {props.alert.code} - {props.alert.errorMessage}
    </div>
);

const BMAlertSuccess = (props) => (
    <div className="alert alert-success" role="alert" onClick={props.close}>
        {props.alert.message}
    </div>
);

export default BMAlert;
