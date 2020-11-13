import EntryPage from "./bhotmEntryPage.js";
import NewPage from "./bhotmEntryNew.js";
import EditPage from "./bhotmEntryEdit.js";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

export default function BhotmEntryRouter() {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/new`} component={NewPage}></Route>
            <Route path={`${path}/:entryId/edit`} component={EditPage}></Route>
            <Route path={`${path}/:entryId`} component={EntryPage}></Route>
        </Switch>
    );
}
