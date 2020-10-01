import { BhotmEntry } from "../components/bhotmEntry.js";

class EntryContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entryLoaded: false,
            entry: null,
        };
    }
    componentDidMount() {
        const href = window.location.pathname.split("/");
        fetch("/api/bhotm/entry/" + href[href.length - 1])
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
            return (
                <div className="container mt-4">
                    <BhotmEntry entry={this.state.entry} />
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
