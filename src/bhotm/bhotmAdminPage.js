import React from "react";
import { showPageError } from "../utils/helpers";
import { Link, Redirect } from "react-router-dom";
import { getEntries, newMasonEntry } from "./api/bhotmEntryApi";
import { getMonths, newMonthType } from "./api/bhotmMonthApi";
import { checkAdmin } from "./api/userApi";

class BhotmAdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentLoaded: false,
            entries: [],
            months: [],
            redirect: null,
        };
        this.newBhotm = this.newBhotm.bind(this);
    }
    componentDidMount() {
        checkAdmin()
            .then(() =>
                Promise.all([getEntries({ unjudged: true }), getMonths()])
            )
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

    newBhotm(type) {
        newMonthType(type)
            .then((res) => {
                this.setState({ redirect: `/bhotm/month/${res._id}` });
            })
            .catch((error) => showPageError(error, this.props.history));
    }

    newMasonEntry(){
        newMasonEntry()
            .then(() => getEntries({ unjudged: true }))
            .then((res) => {
                this.setState({entries: res});
            })
            .catch((error) => showPageError(error, this.props.history));
    }

    render() {
        if (this.state.contentLoaded) {
            const months = this.state.months.map((el) => (
                <li>
                    <Link key={el._id} to={`/bhotm/month/${el._id}`}>
                        {el.month} {el.winner ? " - " + el.winner : null}
                    </Link>
                </li>
            ));

            const entries = this.state.entries.map((el) => (
                <li>
                    <Link key={el._id} to={`/bhotm/entry/${el._id}`}>
                        {el.entryName
                            ? `${el.entryName} - ${el.name}`
                            : el.name}
                    </Link>
                </li>
            ));
            return (
                <div className="container">
                    {this.state.redirect ? (
                        <Redirect to={this.state.redirect} />
                    ) : null}
                    <h2 className="text-center my-3">BHotM Admin</h2>
                    <div className="m-3">
                        <Link
                            className="btn btn-danger m-2"
                            to="/bhotm/entry/new"
                        >
                            New Entry
                        </Link>
                        <button
                            className="btn btn-danger m-2"
                            onClick={() => this.newMasonEntry()}
                        >
                            New Mason
                        </button>
                        <button
                            className="btn btn-primary m-2"
                            onClick={() => this.newBhotm("month")}
                        >
                            Generate BHotM
                        </button>
                        <button
                            className="btn btn-secondary m-2"
                            onClick={() => this.newBhotm("bhoty")}
                        >
                            Generate BHotY
                        </button>
                        <button
                            className="btn btn-secondary m-2"
                            onClick={() => this.newBhotm("blank")}
                        >
                            Generate Blank BHotM
                        </button>
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
