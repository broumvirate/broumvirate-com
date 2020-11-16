import BhotmEntry from "../shared/bhotmEntry";
import EditDeleteButtons from "../shared/editDeleteButtons";
import React from "react";
import { showPageError } from "../../utils/helpers";
import { getEntry } from "../api/bhotmEntryApi";

class EntryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entryLoaded: false,
            entry: null,
        };
    }
    componentDidMount() {
        getEntry(this.props.match.params.entryId)
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
            document.title = `${this.state.entry.name}'s BHotM Submission - The Broumvirate`;
            return (
                <div className="container mt-4">
                    <BhotmEntry entry={this.state.entry} mode="single" />
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
