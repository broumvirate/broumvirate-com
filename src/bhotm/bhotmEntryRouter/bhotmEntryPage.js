import BhotmEntry from "../shared/bhotmEntry";
import EditDeleteButtons from "../shared/editDeleteButtons";
import React from "react";
import { showPageError } from "../../utils/helpers";
import { getEntry } from "../api/bhotmEntryApi";

class EntryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entry: null,
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (props.match.params.entryId !== state.prevId) {
            return {
                entry: null,
                prevId: props.match.params.entryId,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadEntry(this.props.match.params.entryId);
    }

    componentDidUpdate() {
        if (this.state.entry === null) {
            this.loadEntry(this.props.match.params.entryId);
        }
    }
    loadEntry(id) {
        getEntry(id)
            .then((entry) => this.setState({ entry }))
            .catch((error) => {
                showPageError(error, this.props.history);
            });
    }

    render() {
        if (this.state.entry !== null) {
            document.title = `${this.state.entry.name}'s BHotM Submission - The Broumvirate`;
            return (
                <div className="container mt-4">
                    <BhotmEntry
                        entry={this.state.entry}
                        unjudged={!this.state.entry.hasBeenJudged}
                        linkToMonth
                    />
                    <EditDeleteButtons
                        context="Entry"
                        editEndpoint={`/bhotm/entry/${this.state.entry._id}/edit`}
                        deleteEndpoint={`/api/bhotm/entry/${this.state.entry._id}`}
                        redirect="/bhotm/admin"
                        history={this.props.history}
                    />
                </div>
            );
        } else {
            return <div className="container mt-4"></div>;
        }
    }
}

export default EntryPage;
