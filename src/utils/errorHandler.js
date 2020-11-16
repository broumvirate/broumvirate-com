import React from "react";
import { useLocation } from "react-router-dom";
import ErrorPage from "./errorPage";

const ErrorHandler = ({ children }) => {
    const location = useLocation();
    if (!location.state) {
        return children;
    } else if (location.state.error) {
        return <ErrorPage {...location.state.error} />;
    }
    return children;
};

export default ErrorHandler;
