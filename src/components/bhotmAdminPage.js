import React from "react";
import {
    handleFetchErrors,
    showPageError,
    checkAuth,
} from "../helpers/helpers.js";
import { Link } from "react-router-dom";

class BhotmAdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentLoaded: false,
            entries: [],
            months: [],
        };
    }
    componentDidMount() {
        checkAuth()
            .then((res) => {
                if (res.isAdmin) {
                    return Promise.all([
                        fetch("/api/bhotm/entry?filter=unjudged").then(
                            handleFetchErrors
                        ),
                        fetch("/api/bhotm/month").then(handleFetchErrors),
                    ]);
                } else {
                    throw { code: 403, errorMessage: "Forbidden" };
                }
            })
            .then((res) => {
                this.setState({
                    contentLoaded: true,
                    entries: res[0],
                    months: res[1],
                });
            })
            .catch((error) => {
                showPageError(error, this.props.history);
            });
    }
    render() {
        if (this.state.contentLoaded) {
            const months = this.state.months.map((el) => (
                <li>
                    <Link key={el._id} to={`/bhotm/month/${el._id}`}>
                        {el.month}
                    </Link>
                </li>
            ));

            const entries = this.state.entries.map((el) => (
                <li>
                    <Link key={el._id} to={`/bhotm/entry/${el._id}`}>
                        {el.name}
                    </Link>
                </li>
            ));
            return (
                <div className="container">
                    <h2 className="text-center my-3">BHotM Admin</h2>
                    <div className="m-3">
                        <Link
                            className="btn btn-danger mx-2"
                            to="/bhotm/entry/new"
                        >
                            New Entry
                        </Link>
                    </div>
                    <p>
                        <strong>Months:</strong>
                    </p>
                    <ul>{months}</ul>
                    <p>
                        <strong>Unjudged Entries:</strong>
                    </p>
                    <ul>{entries}</ul>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default BhotmAdminPage;
