import BhotmEntry from "./bhotmEntry.js";
import EditDeleteButtons from "./editDeleteButtons.js";
import React from "react";

// Fully rendered page displaying a whole month of BHotM

class MonthPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monthLoaded: false,
            month: null,
        };
    }
    // Load the data
    componentDidMount() {
        fetch("/api/bhotm/month/" + this.props.match.params.monthId)
            .then((res) => res.json())
            .then((res) => {
                res.submissions.sort((a, b) => b.place - a.place);
                if (res.isBhoty) {
                    res.submissions.sort((a, b) => b.bhotyPlace - a.bhotyPlace);
                }
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
            // Set some page variables
            document.title = `${this.state.month.month} BHotM - The Broumvirate`;
            const total = this.state.month.submissions.length;

            // Generate entries
            const entries = this.state.month.submissions.map((el, i) => (
                <div className="mt-5" key={el._id}>
                    <BhotmEntry
                        entry={el}
                        total={total}
                        mode={this.state.month.isBhoty ? "bhoty" : "month"}
                        unjudged={!this.state.hasBeenJudged}
                    />
                </div>
            ));

            return (
                <div className="container mt-4">
                    {/* Header */}
                    <h1 className="text-center display-3">
                        {this.state.month.month}
                    </h1>
                    <h4 className="text-center">Ben Hagle of the Month</h4>
                    {this.state.month.judge ? (
                        <h4 className="text-center">
                            Judged by {this.state.month.judge}
                        </h4>
                    ) : null}
                    {this.state.month.notes ? (
                        <p className="text-center mt-2">
                            {this.state.month.notes}
                        </p>
                    ) : null}

                    {entries}

                    <EditDeleteButtons
                        context="Month"
                        editEndpoint={
                            "/bhotm/month/" + this.state.month._id + "/edit"
                        }
                        deleteEndpoint={
                            "/api/bhotm/month/" + this.state.month._id
                        }
                        redirect="/bhotm"
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
