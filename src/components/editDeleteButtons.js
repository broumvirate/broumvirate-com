import { handleFetchErrors, showPageError } from "../helpers/helpers.js";
import { checkAuth } from "../apiCalls/bhotmEntryApi.js";
import React from "react";
import { Link, Redirect } from "react-router-dom";

class EditDeleteButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoaded: false,
            user: null,
            hasDeleted: false,
        };
    }
    componentDidMount() {
        checkAuth()
            .then((res) => {
                this.setState({
                    userLoaded: true,
                    user: res,
                });
            })
            .catch();
    }
    onDelete() {
        fetch(this.props.deleteEndpoint, { method: "DELETE" })
            .then(handleFetchErrors)
            .then((res) => {
                if (res.completed) {
                    this.setState({ hasDeleted: true });
                }
            })
            .catch((error) => showPageError(error, this.props.history));
    }
    render() {
        if (this.state.userLoaded && this.state.user.isAdmin) {
            if (this.state.hasDeleted) {
                return <Redirect to={this.props.redirect} />;
            }

            return (
                <div className="m-2">
                    <Link
                        className="btn btn-secondary text-white"
                        to={this.props.editEndpoint}
                    >
                        Edit {this.props.context}
                    </Link>
                    <a
                        className="btn btn-danger mx-2 text-white"
                        data-toggle="modal"
                        data-target="#deleteModal"
                    >
                        Delete {this.props.context}
                    </a>
                    <DeleteModal
                        context={this.props.context}
                        onDelete={this.onDelete.bind(this)}
                    />
                </div>
            );
        } else {
            return null;
        }
    }
}

function DeleteModal(props) {
    return (
        <div
            className="modal fade"
            tabIndex="-1"
            role="dialog"
            id="deleteModal"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Are you sure you want to delete this{" "}
                            {props.context.toLowerCase()}?
                        </h5>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-footer">
                        <button
                            onClick={props.onDelete}
                            className="btn btn-danger"
                            data-dismiss="modal"
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditDeleteButtons;
