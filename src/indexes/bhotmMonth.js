import BhotmEntry from "../components/bhotmEntry.js";
import EditDeleteButtons from "../components/editDelete.js";

class MonthContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monthLoaded: false,
            month: null,
        };
    }
    componentDidMount() {
        const href = window.location.pathname.split("/");
        fetch("/api/bhotm/month/" + href[href.length - 1])
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    monthLoaded: true,
                    month: res,
                });
            })
            .catch((err) => {
                this.setState({
                    monthLoaded: true,
                    error,
                });
            });
    }

    render() {
        if (this.state.monthLoaded) {
            document.title = `${this.state.month.month} BHotM - The Broumvirate`;
            const total = this.state.month.submissions.length;
            const entries = this.state.month.submissions.map((el) => {
                return (
                    <div className="mb-5" key={el._id}>
                        <BhotmEntry entry={el} total={total} />
                    </div>
                );
            });
            return (
                <div className="container mt-4">
                    {entries}
                    <EditDeleteButtons context="Month" />
                </div>
            );
        } else {
            return (
                <div className="container mt-4">
                    <p>Loading Month...</p>
                </div>
            );
        }
    }
}

ReactDOM.render(<MonthContainer />, document.getElementById("app"));
