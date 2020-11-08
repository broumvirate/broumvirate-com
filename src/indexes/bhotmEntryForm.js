import BhotmForm from "../components/bhotmForm.js";

class EntryFormContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="container mt-4">
                <h1>BHotM Entry</h1>
                <BhotmForm mode="new" />
            </div>
        );
    }
}

ReactDOM.render(<EntryForm />, document.getElementById("app"));
