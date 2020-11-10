import EntryPage from "./bhotmEntryPage.js";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

export default function BhotmEntryRouter() {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/new`}>
                <div>New BHotM entry</div>
            </Route>
            <Route path={`${path}/:entryId/edit`}>
                <div>Edit the entry!!!!</div>
            </Route>
            <Route path={`${path}/:entryId`} component={EntryPage}></Route>
        </Switch>
    );
}
