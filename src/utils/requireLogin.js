import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { checkAuth, checkAdmin } from "../bhotm/api/userApi";
import { showPageError } from "./helpers";

export default function RequireLogin(props) {
    const [user, setUser] = useState();
    const history = useHistory();
    useEffect(() => {
        let mounted = true;
        if (!user) {
            checkAuth()
                .then((u) => {
                    if (mounted) setUser(u);
                })
                .catch(() => {
                    showPageError(
                        {
                            code: 401,
                            errorMessage: "Unauthorized",
                        },
                        history
                    );
                });
        }
        return () => (mounted = false);
    }, []);
    if (user && user.isLoggedIn) {
        return <>{props.children}</>;
    } else if (user && !user.isLoggedIn) {
        console.log("not logged in");
        showPageError(
            {
                code: 401,
                errorMessage: "Unauthorized",
            },
            history
        );
        return null;
    } else {
        return null;
    }
}
