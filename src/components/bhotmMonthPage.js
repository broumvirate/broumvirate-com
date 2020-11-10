import BhotmEntry from "./bhotmEntry.js";
import EditDeleteButtons from "./editDeleteButtons.js";
import React from "react";

class MonthPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monthLoaded: false,
            month: null,
        };
    }
    componentDidMount() {
        fetch("/api/bhotm/month/" + this.props.match.params.monthId)
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
                        <BhotmEntry entry={el} total={total} mode="month" />
                    </div>
                );
            });

            return (
                <div className="container mt-4">
                    {entries}
                    <EditDeleteButtons
                        context="Month"
                        editEndpoint={
                            "/api/bhotm/month/" + this.state.month._id + "/edit"
                        }
                        deleteEndpoint={
                            "/api/bhotm/month/" + this.state.month._id
                        }
                        redirect="/bhotm2"
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

export default MonthPage;
