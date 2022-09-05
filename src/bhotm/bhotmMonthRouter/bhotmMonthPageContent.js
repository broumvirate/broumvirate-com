import BhotmEntry from "../shared/bhotmEntry";
import EditDeleteButtons from "../shared/editDeleteButtons";
import { Link } from "react-router-dom";
import React from "react";

const BhotmMonthPageContent = ({ month }) => {
    // Generate entries
    const entries = month.submissions.map((el, i) => (
        <div className="mt-5" key={el._id}>
            <BhotmEntry
                entry={el}
                unjudged={!month.hasBeenJudged}
                linkToEntry
                linkToMonth={month.isBhoty}
                bhoty={month.isBhoty}
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
            <h1 className="text-center display-3">{month.month}</h1>
            <h4 className="text-center">
                Ben Hagle of the {month.isBhoty ? "Year" : "Month"}
            </h4>
            {month.judge ? (
                <h4 className="text-center">Judged by {month.judge}</h4>
            ) : null}
            {month.notes ? (
                <p className="text-center mt-2">{month.notes}</p>
            ) : null}
            
            <BhotmNextPrevMonth month={month}/>

            {entries}

            <EditDeleteButtons
                context="Month"
                editEndpoint={`/bhotm/month/${month._id}/edit`}
                deleteEndpoint={`/api/bhotm/month/${month._id}`}
                redirect="/bhotm/admin"
            />
        </div>
    );
};

const BhotmNextPrevMonth = ({month}) => (
    month.nextMonth || month.previousMonth ? (
    <div className="d-flex">
        {month.previousMonth ?
        <p className="text-muted">
            <Link to={`/bhotm/month/${month.previousMonth}`} className="text-reset">{"⬅️ Previous Month"}</Link>
        </p> : null }
        {month.nextMonth ?
        <p className="ml-auto text-muted">
            <Link to={`/bhotm/month/${month.nextMonth}`} className="text-reset">{"Next Month ➡️"}</Link>
        </p> : null}
    </div>
)
: null)

export default BhotmMonthPageContent;
