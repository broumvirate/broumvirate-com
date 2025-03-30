import EntryPage from "./bhotmEntryRouter/bhotmEntryPage";
import NewPage from "./bhotmEntryRouter/bhotmEntryNew";
import EditPage from "./bhotmEntryRouter/bhotmEntryEdit";
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
