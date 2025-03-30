import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ErrorHandler from "./utils/errorHandler";
import ErrorPage from "./utils/errorPage";
import BhotmEntryRouter from "./bhotm/bhotmEntryRouter";
import BhotmMonthRouter from "./bhotm/bhotmMonthRouter";
import BhotmIndexTempTemp from "./bhotm/bhotmIndexTempTemp";
import BhotmAdminPage from "./bhotm/bhotmAdminPage";
import BhothmGeneratorPage from "./bhothmGenerator/bhothmGeneratorPage";
import AddBhothmText from "./bhothmGenerator/bhothmText";
import RequireLogin from "./utils/requireLogin";
import BoyPage from "./bhotm/bhotmBoyPage";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const PREFIX = "/bhotm/";

const BHotM = () => (
    <BrowserRouter>
        <ErrorHandler>
            <Switch>
                <Route exact path={PREFIX} component={BhotmIndexTempTemp} />
                <Route path={PREFIX + "bhothm-generator/add"}>
                    <RequireLogin>
                        <AddBhothmText />
                    </RequireLogin>
                </Route>
                <Route path={PREFIX + "bhothm-generator"}>
                    <RequireLogin>
                        <BhothmGeneratorPage />
                    </RequireLogin>
                </Route>
                <Route path={PREFIX + "entry"}>
                    <BhotmEntryRouter />
                </Route>
                <Route path={PREFIX + "month"}>
                    <BhotmMonthRouter />
                </Route>
                <Route path={PREFIX + "boy/:boyId"} component={BoyPage}/>
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
