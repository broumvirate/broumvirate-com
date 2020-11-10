import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BhotmEntryRouter from "./components/bhotmEntryRouter";
import BhotmMonthRouter from "./components/bhotmMonthRouter";

const PREFIX = "/bhotm2/";

const BHotM = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path={PREFIX}>
                <div>BHotM Index</div>
            </Route>
            <Route path={PREFIX + "entry"}>
                <BhotmEntryRouter />
            </Route>
            <Route path={PREFIX + "month"}>
                <BhotmMonthRouter />
            </Route>
            <Route path={PREFIX + "admin"}>
                <div>BhotmAdmin</div>
            </Route>
            <Route path={PREFIX}>
                <div>404</div>
            </Route>
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(<BHotM />, document.getElementById("app"));
