import React, { useState, useEffect } from "react";
import { showPageError } from "../utils/helpers";
import { useRouteMatch, useHistory, Link } from "react-router-dom";
import { getBoyEntries } from "./api/bhotmEntryApi";
import BhotmEntry from "./shared/bhotmEntry";

const BoyPage = (props) => {
    const match = useRouteMatch();
    const history = useHistory();
    const [data, setData] = useState(null);

    // Load the data
    useEffect(() => {
        getBoyEntries(match.params.boyId)
            .then((result) => {
                document.title = `${result.boy.name}'s Submissions - BHotM - The Broumvirate`;
                console.log(result);
                setData(result);
            })
            .catch((error) => {
                showPageError(error, history);
            });
    }, [match.params.boyId]);

    if (data !== null) {
        return <BoyPageContent boy={data.boy} submissions={data.submissions}/>;
    } else {
        return <div className="container mt-4"></div>;
    }

}

const BoyPageContent = ({boy, submissions}) => {
    // Generate entries
    const entries = submissions.map((el, i) => (
        <div className="mt-5" key={el._id}>
            <BhotmEntry
                entry={el}
                unjudged={!el.hasBeenJudged}
                linkToEntry
                linkToMonth={true}
                bhoty={false}
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
            <h1 className="text-center display-3">{boy.name}'s Submissions</h1>
            <h4 className="text-center">
                Ben Hagle of the Month
            </h4>

            {entries}
        </div>
    );
}

export default BoyPage