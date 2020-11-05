import { checkAuth } from "../helpers.js";

class EditDeleteButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoaded: false,
            user: null,
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
    editClick() {
        console.log("Clicked edit!");
    }
    render() {
        if (this.state.userLoaded && this.state.user.isAdmin) {
            return (
                <div className="m-2">
                    <a
                        className="btn btn-secondary text-white"
                        href={this.props.editEndpoint}
                    >
                        Edit {this.props.context}
                    </a>
                    <a
                        className="btn btn-danger mx-2 text-white"
                        data-toggle="modal"
                        data-target="#deleteModal"
                    >
                        Delete {this.props.context}
                    </a>
                    <DeleteModal
                        context={this.props.context}
                        deleteEndpoint={this.props.deleteEndpoint}
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
                        <form
                            action={props.deleteEndpoint + "?_method=DELETE"}
                            method="POST"
                        >
                            <button className="btn btn-danger">Yes</button>
                        </form>
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
