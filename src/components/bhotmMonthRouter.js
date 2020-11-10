import MonthPage from "./bhotmMonthPage.js";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

export default function BhotmEntryRouter() {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/:monthId`} component={MonthPage}></Route>
        </Switch>
    );
}
