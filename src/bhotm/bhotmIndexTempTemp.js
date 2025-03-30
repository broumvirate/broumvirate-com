import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { handleFetchErrors, showPageError, showAlert } from "../utils/helpers";
import BhotmCountdown from "./shared/bhotmCountdown";

const BhotmIndexTempTemp = () => {
    const history = useHistory();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/api/bhotm/month?filter=judged")
            .then(handleFetchErrors)
            .then(setData)
            .catch((error) => {
                showPageError(error, history);
            });
    }, []);

    const months =
        data !== null
            ? data.map((el, i) => (
                  <h5
                      className="list-group-item list-group-item-action"
                      style={{ marginBottom: "0" }}
                      key={el._id}
                  >
                      <Link to={`/bhotm/month/${el._id}`}>{el.month}</Link>
                  </h5>
              ))
            : null;

    return (
        <div className="container">
            <div>
                <h1 className="display-4 my-3">Ben Hagle of the Month</h1>
                <h4 className="">Try our new online submission form:</h4>
                <Link to="/bhotm/entry/new" className="btn btn-primary">
                    Submit to BHotM
                </Link>

                <Link
                    to="/bhotm/bhothm-generator"
                    className="btn btn-success mx-2"
                >
                    I'm Feeling BHOTHM
                </Link>
                <p className="lead my-3">
                    Ben Hagle of the Month is a monthly competetion to determine
                    who is Ben Hagle. Submissions can be literally anything,
                    creativity is encouraged. The winner is decided by the
                    previous Ben Hagle. Submissions can be sent to{" "}
                    <a href="mailto:hen.bagle@gmail.com">hen.bagle@gmail.com</a>
                    , and are due on the 4th of each month, at midnight in your
                    local timezone.
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
};

export default BhotmIndexTempTemp;
