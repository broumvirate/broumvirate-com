import React from "react";
import { useLocation } from "react-router-dom";

const ErrorHandler = ({ children }) => {
    const location = useLocation();
    if (!location.state) {
        return children;
    } else if (location.state.errorStatusCode) {
        return (
            <div>
                <h1 className="text-center display-1">
                    {location.state.errorStatusCode}
                </h1>
                <h2 className="text-center">{location.state.errorMessage}</h2>
            </div>
        );
    }
    return children;
};

export default ErrorHandler;
