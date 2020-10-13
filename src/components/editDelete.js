class EditDeleteButtons extends React.Component {
    constructor(props) {
        super(props);
    }
    editClick() {
        console.log("Clicked edit!");
    }
    deleteClick() {
        console.log("Clicked delete!");
    }
    render() {
        return (
            <div className="m-2">
                <button className="btn btn-secondary" onClick={this.editClick}>
                    Edit {this.props.context}
                </button>
                <button
                    className="btn btn-danger mx-2"
                    onClick={this.deleteClick}
                >
                    Delete {this.props.context}
                </button>
            </div>
        );
    }
}
export default EditDeleteButtons;
