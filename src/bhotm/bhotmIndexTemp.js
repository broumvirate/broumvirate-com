import React from "react";
import { Link } from "react-router-dom";
import BhotmEntry from "./shared/bhotmEntry";
import { handleFetchErrors, showPageError } from "../utils/helpers";

function MonthTemp(props) {
    const entries = props.month.submissions
        .sort((a, b) => a.place - b.place)
        .map((el, i) => (
            <div className="mb-3" key={el._id}>
                <BhotmEntry
                    entry={el}
                    total={props.month.submissions.length}
                    mode="month"
                />
            </div>
        ));
    return (
        <div className="card">
            <div className="card-header">
                <Link to={`/bhotm/month/${props.month._id}`}>
                    <h4 className="mb-0">{props.month.month}</h4>
                </Link>
            </div>
            <div className="card-body">
                <div className="card-columns">{entries}</div>
                <h5 className="mx-auto">{props.month.notes}</h5>
            </div>
        </div>
    );
}

class BhotmIndexTemp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            data: [],
        };
    }
    componentDidMount() {
        fetch("/api/bhotm")
            .then(handleFetchErrors)
            .then((res) => {
                this.setState({
                    dataLoaded: true,
                    data: res,
                });
            })
            .catch((error) => {
                showPageError(error, this.props.history);
            });
    }

    render() {
        const months = this.state.dataLoaded
            ? this.state.data.map((el, i) => (
                  <MonthTemp month={el} i={i} key={el._id} />
              ))
            : null;
        return (
            <div className="container">
                <div>
                    <h1 className="display-4 my-3">Ben Hagle of the Month</h1>
                    <h4 className="my-3">
                        This is the WIP new BHotM page. It is not done. You can
                        get to the old one <a href="/bhotmold">here.</a>
                    </h4>
                    <h4 className="">Try our new online submission form:</h4>
                    <Link to="/bhotm/entry/new" className="btn btn-primary">
                        Submit to BHotM
                    </Link>
                    <p className="lead my-3">
                        Ben Hagle of the Month is a monthly competetion to
                        determine who is Ben Hagle. Submissions can be literally
                        anything, creativity is encouraged. The winner is
                        decided by the previous Ben Hagle. Submissions can be
                        sent to{" "}
                        <a href="mailto:hen.bagle@gmail.com">
                            hen.bagle@gmail.com
                        </a>
                        , and are due on the 4th of each month, at midnight in
                        your local timezone.
                    </p>
                    <h2 className="display-5 my-4">Previous submissions</h2>
                </div>
                <div className="accordion" id="previousAccordion">
                    {months}
                </div>
            </div>
        );
    }
}

export default BhotmIndexTemp;
