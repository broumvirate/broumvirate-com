import React from "react";
import { Link } from "react-router-dom";
import BhotmEntry from "./shared/bhotmEntry";
import { handleFetchErrors, showPageError } from "../utils/helpers";
import BhotmCountdown from "./shared/bhotmCountdown";

class BhotmIndexTemp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            data: [],
        };
    }
    componentDidMount() {
        fetch("/api/bhotm/month?filter=judged")
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
                  <h5
                      className="list-group-item list-group-item-action"
                      style={{ marginBottom: "0" }}
                  >
                      <Link to={`/bhotm/month/${el._id}`}>{el.month}</Link>
                  </h5>
              ))
            : null;
        return (
            <div className="container">
                <div>
                    <h1 className="display-4 my-3">Ben Hagle of the Month</h1>
                    <h4 className="my-3">
                        This is a new temporary BHotM page. It is not done. You
                        can get to the old, old one{" "}
                        <a href="/bhotmold">here.</a>
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
                    <BhotmCountdown />
                </div>
                <div className="list-group list-group-flush">
                    <div className="list-group-item">
                        <h2>Previous Submissions:</h2>
                    </div>
                    {months}
                </div>
            </div>
        );
    }
}

export default BhotmIndexTemp;
