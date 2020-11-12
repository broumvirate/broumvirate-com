import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ErrorHandler from "./components/errorHandling/errorHandler.js";
import ErrorPage from "./components/errorHandling/errorPage.js";
import BhotmEntryRouter from "./components/bhotmEntryRouter";
import BhotmMonthRouter from "./components/bhotmMonthRouter";
import BhotmIndexTemp from "./components/bhotmIndexTemp";
import BhotmAdminPage from "./components/bhotmAdminPage";

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
