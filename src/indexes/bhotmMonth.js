import BhotmEntry from "../components/bhotmEntry.js";
import EditDeleteButtons from "../components/editDelete.js";

class MonthContainer extends React.Component {
    constructor(props) {
        super(props);
        const href = window.location.pathname.split("/");
        this.state = {
            id: href[href.length - 1],
            monthLoaded: false,
            month: null,
        };
    }
    componentDidMount() {
        fetch("/api/bhotm/month/" + this.state.id)
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
        const href = window.location.pathname.split("/");
        if (this.state.monthLoaded) {
            document.title = `${this.state.month.month} BHotM - The Broumvirate`;
            const total = this.state.month.submissions.length;

            const entries = this.state.month.submissions.map((el, i) => {
                let classNames = "mt-5";
                if (i == 0) classNames = "";
                return (
                    <div className={classNames} key={el._id}>
                        <BhotmEntry entry={el} total={total} />
                    </div>
                );
            });

            return (
                <div className="container mt-4">
                    {entries}
                    <EditDeleteButtons
                        context="Month"
                        editEndpoint={
                            "/api/bhotm/month/" + this.state.id + "/edit"
                        }
                        deleteEndpoint={"/api/bhotm/month/" + this.state.id}
                    />
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
