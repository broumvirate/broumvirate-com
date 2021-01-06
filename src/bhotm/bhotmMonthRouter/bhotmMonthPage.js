import BhotmEntry from "../shared/bhotmEntry";
import EditDeleteButtons from "../shared/editDeleteButtons";
import React from "react";
import { showPageError } from "../../utils/helpers";
import { getMonth } from "../api/bhotmMonthApi";
import { Link } from "react-router-dom";

// Fully rendered page displaying a whole month of BHotM

class MonthPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            month: null,
        };
        this.loadData = this.loadData.bind(this);
    }
    static getDerivedStateFromProps(props, state) {
        if (props.match.params.monthId !== state.prevId) {
            return {
                month: null,
                prevId: props.match.params.monthId,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadData(this.props.match.params.monthId);
    }

    componentDidUpdate() {
        if (this.state.month === null) {
            this.loadData(this.props.match.params.monthId);
        }
    }
    // Load the data
    loadData(id) {
        getMonth(id)
            .then((month) => {
                month.submissions.sort((a, b) => a.place - b.place);
                if (month.isBhoty) {
                    month.submissions.sort(
                        (a, b) => b.bhotyPlace - a.bhotyPlace
                    );
                }
                this.setState({ month });
            })
            .catch((error) => {
                showPageError(error, this.props.history);
            });
    }

    render() {
        if (this.state.month !== null) {
            // Set some page variables
            document.title = `${this.state.month.month} - BHotM - The Broumvirate`;

            // Generate entries
            const entries = this.state.month.submissions.map((el, i) => (
                <div className="mt-5" key={el._id}>
                    <BhotmEntry
                        entry={el}
                        unjudged={!this.state.month.hasBeenJudged}
                        linkToEntry
                        linkToMonth={this.state.month.isBhoty}
                        bhoty={this.state.month.isBhoty}
                    />
                </div>
            ));

            return (
                <div className="container mt-4">
                    <p className="text-muted d-inline">
                        <Link to={"/bhotm/"} className="text-reset">
                            Back to BHotM Page
                        </Link>
                    </p>
                    {/* Header */}
                    <h1 className="text-center display-3">
                        {this.state.month.month}
                    </h1>
                    <h4 className="text-center">
                        Ben Hagle of the{" "}
                        {this.state.month.isBhoty ? "Year" : "Month"}
                    </h4>
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
                        editEndpoint={`/bhotm/month/${this.state.month._id}/edit`}
                        deleteEndpoint={`/api/bhotm/month/${this.state.month._id}`}
                        redirect="/bhotm/admin"
                        history={this.props.history}
                    />
                </div>
            );
        } else {
            return <div className="container mt-4"></div>;
        }
    }
}

export default MonthPage;
