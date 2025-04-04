import React from "react";
import { Link } from "react-router-dom";

// Full header for BHotM single entry view
function BhotmHeader(props) {
    // Define header elements, with ternary switches based on certain flags
    // Use either the submission title, or the submittee's name as the title
    let hasMonth = props.entry.month !== undefined;

    if (hasMonth) {
        hasMonth = props.entry.month._id ? true : false;
    }

    let heading = props.entry.entryName ? (
        <span className="bhotm-header-title">
            <h1 className="mr-2">{props.entry.entryName}</h1>
            <h3 className="text-muted"> by {props.entry.name}</h3>
        </span>
    ) : (
        <span className="bhotm-header-title">
            <h1 className="mr-2">{props.entry.name}</h1>
        </span>
    );

    // Use title as link to single entry, if needed
    if (props.linkToEntry) {
        heading = (
            <Link
                className="bhotm-header-clickable"
                to={`/bhotm/entry/${props.entry._id}`}
            >
                {heading}
            </Link>
        );
    }

    // If this is a judged submission, display the place
    let place = props.unjudged ? (
        <div></div>
    ) : props.bhoty ? (
        <BhotyPlace place={props.entry.bhotyPlace} />
    ) : (
        <BhotmPlace
            place={props.entry.place}
            isWinner={props.entry.place === 1}
        />
    );

    // Define month and description
    let month =
        props.linkToMonth && props.entry.hasBeenJudged ? (
            <Link
                to={`/bhotm/month/${
                    hasMonth ? props.entry.month._id : props.entry.month
                }`}
            >
                <h5>{hasMonth ? props.entry.month.month : "Link to month"}</h5>
            </Link>
        ) : null;

    let userLink =
        props.linkToUser && props.entry.hasBeenJudged && props.entry.boy.length > 0 ? (
            <div className="d-flex flex-row">
            {props.entry.boy.map((b) => (
                <Link 
                    id={b._id} 
                    to={`/bhotm/boy/${b._id}`}>
                    <h5 className="pr-2">{`${b.name}'s Submissions`}</h5>
                </Link>
            ))}
            </div>
        ) : null;


    let description = (
        <h6 className="text-muted mt-0">{props.entry.entryDescription}</h6>
    );

    return (
        <div>
            <div className="bhotm-header">
                <div className="bhotm-header-text">
                    {heading}
                    {description}
                    {month}
                    {userLink}
                </div>
                {place}
            </div>
        </div>
    );
}

// Place widget thingo
function BhotyPlace(props) {
    let classN = "text-muted";
    if (props.isWinner) {
        classN = "text-success";
    }
    return (
        <div className="bhotm-header-place">
            <h3 className={classN}>
                {props.place} {props.place === 1 ? "vote" : "votes"}
            </h3>
        </div>
    );
}

// Place widget thingo
function BhotmPlace(props) {
    let classN = "text-muted";
    let inside = ordinalSuffix(props.place);
    if (props.isWinner) {
        classN = "text-success";
    }
    return (
        <div className="bhotm-header-place">
            <h3 className={classN}>{inside}</h3>
        </div>
    );
}

// Get the nd and rd
function ordinalSuffix(i) {
    if (!i || i <= 0) {
        return;
    }

    const j = i % 10,
        k = i % 100;

    if (j === 1 && k != 11) {
        return i + "st";
    }
    if (j === 2 && k != 12) {
        return i + "nd";
    }
    if (j === 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

export default BhotmHeader;
