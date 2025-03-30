import React from "react";

const ErrorPage = (props) => {
    return (
        <div>
            <h1 className="text-center display-1">{props.code}</h1>
            <h2 className="text-center">{props.errorMessage}</h2>
        </div>
    );
};

export default ErrorPage;
