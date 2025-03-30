import { handleFetchErrors, showPageError } from "../../utils/helpers";
import { checkAuth } from "../api/userApi";
import React, { useState, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";

const EditDeleteButtons = (props) => {
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [hasDeleted, setHasDeleted] = useState(false);

    useEffect(() => {
        checkAuth().then(setUser).catch();
    }, []);

    if (user?.isAdmin) {
        if (hasDeleted) {
            return <Redirect to={props.redirect} />;
        }

        return (
            <div className="m-2">
                <Link
                    className="btn btn-secondary text-white"
                    to={props.editEndpoint}
                >
                    Edit {props.context}
                </Link>
                <a
                    className="btn btn-danger mx-2 text-white"
                    data-toggle="modal"
                    data-target="#deleteModal"
                >
                    Delete {props.context}
                </a>
                <DeleteModal
                    context={props.context}
                    onDelete={() => {
                        fetch(props.deleteEndpoint, { method: "DELETE" })
                            .then(handleFetchErrors)
                            .then((res) => {
                                if (res.completed) {
                                    setHasDeleted(true);
                                }
                            })
                            .catch((error) => showPageError(error, history));
                    }}
                />
            </div>
        );
    } else {
        return null;
    }
};

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
