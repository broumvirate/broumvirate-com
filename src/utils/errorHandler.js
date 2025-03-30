import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import BMAlert from "./BMAlert";
import ErrorPage from "./errorPage";

const ErrorHandler = ({ children }) => {
    const location = useLocation();
    const history = useHistory();
    if (location?.state?.error) {
        return <ErrorPage {...location?.state.error} />;
    }
    return (
        <div>
            {location?.state && (
                <BMAlert
                    alert={location?.state.alert}
                    close={() => {
                        history.replace(history.location.pathname, {
                            close: null,
                        });
                    }}
                />
            )}
            {children}
        </div>
    );
};

export default ErrorHandler;
