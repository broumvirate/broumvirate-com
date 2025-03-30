import MonthPage from "./bhotmMonthRouter/bhotmMonthPage";
import MonthEditPage from "./bhotmMonthRouter/bhotmMonthEdit";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

export default function BhotmEntryRouter() {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/new`}>We don't have this</Route>
            <Route
                path={`${path}/:monthId/edit`}
                component={MonthEditPage}
            ></Route>
            <Route path={`${path}/:monthId`} component={MonthPage}></Route>
        </Switch>
    );
}
