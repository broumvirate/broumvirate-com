import BhotmEntry from "../components/bhotmEntry.js";
import EditDeleteButtons from "../components/editDelete.js";

class EntryContainer extends React.Component {
    constructor(props) {
        super(props);
        const href = window.location.pathname.split("/");
        this.state = {
            id: href[href.length - 1],
            entryLoaded: false,
            entry: null,
        };
    }
    componentDidMount() {
        fetch("/api/bhotm/entry/" + this.state.id)
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    entryLoaded: true,
                    entry: res,
                });
            })
            .catch((err) => {
                this.setState({
                    entryLoaded: true,
                    error,
                });
            });
    }

    render() {
        if (this.state.entryLoaded) {
            document.title = `${this.state.entry.name}'s ${this.state.entry.month.month} BHotM Submission - The Broumvirate`;
            return (
                <div className="container mt-4">
                    <BhotmEntry entry={this.state.entry} />
                    <EditDeleteButtons
                        context="Entry"
                        editEndpoint={
                            "/api/bhotm/entry/" + this.state.id + "/edit"
                        }
                        deleteEndpoint={"/api/bhotm/entry/" + this.state.id}
                    />
                </div>
            );
        } else {
            return (
                <div className="container mt-4">
                    <p>Loading Entry...</p>
                </div>
            );
        }
    }
}

ReactDOM.render(<EntryContainer />, document.getElementById("app"));
