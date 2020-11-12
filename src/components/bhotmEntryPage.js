import BhotmEntry from "./bhotmEntry.js";
import EditDeleteButtons from "./editDeleteButtons.js";
import React from "react";
import { handleFetchErrors, showPageError } from "../helpers/helpers.js";

class EntryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entryLoaded: false,
            entry: null,
        };
    }
    componentDidMount() {
        fetch("/api/bhotm/entry/" + this.props.match.params.entryId)
            .then(handleFetchErrors)
            .then((res) => {
                this.setState({
                    entryLoaded: true,
                    entry: res,
                });
            })
            .catch((error) => {
                showPageError(error, this.props.history);
            });
    }

    render() {
        if (this.state.entryLoaded) {
            document.title = `${this.state.entry.name}'s ${this.state.entry.month.month} BHotM Submission - The Broumvirate`;
            return (
                <div className="container mt-4">
                    <BhotmEntry entry={this.state.entry} mode="single" />
                    <EditDeleteButtons
                        context="Entry"
                        editEndpoint={
                            "/bhotm/entry/" + this.state.entry._id + "/edit"
                        }
                        deleteEndpoint={
                            "/api/bhotm/entry/" + this.state.entry._id
                        }
                        redirect="/bhotm2"
                    />
                </div>
            );
        } else {
            return <div className="container mt-4"></div>;
        }
    }
}

export default EntryPage;
