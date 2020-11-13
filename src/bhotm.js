import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ErrorHandler from "./utils/errorHandler";
import ErrorPage from "./utils/errorPage";
import BhotmEntryRouter from "./bhotm/bhotmEntryRouter";
import BhotmMonthRouter from "./bhotm/bhotmMonthRouter";
import BhotmIndexTemp from "./bhotm/bhotmIndexTemp";
import BhotmAdminPage from "./bhotm/bhotmAdminPage";

const PREFIX = "/bhotm/";

const BHotM = () => (
    <BrowserRouter>
        <ErrorHandler>
            <Switch>
                <Route exact path={PREFIX}>
                    <BhotmIndexTemp />
                </Route>
                <Route path={PREFIX + "entry"}>
                    <BhotmEntryRouter />
                </Route>
                <Route path={PREFIX + "month"}>
                    <BhotmMonthRouter />
                </Route>
                <Route
                    path={PREFIX + "admin"}
                    component={BhotmAdminPage}
                ></Route>
                <Route path={PREFIX}>
                    <ErrorPage errorStatusCode={404} errorMessage="Not Found" />
                </Route>
            </Switch>
        </ErrorHandler>
    </BrowserRouter>
);

ReactDOM.render(<BHotM />, document.getElementById("app"));
