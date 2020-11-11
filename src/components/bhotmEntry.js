import BhotmEntryContent from "./bhotmEntryContent.js";
import React from "react";
import { Link, NavLink } from "react-router-dom";

// Full entry, including header and content. Single page entry info
class BhotmEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: props.total
                ? props.total
                : props.entry.month.submissions.length,
        };

        if (this.props.entry.place === 1 && this.props.entry.bhotyPlace <= 1) {
            this.state.class = "bhotm-entry bhotm-winner";
        } else {
            this.state.class = "bhotm-entry";
        }
    }
    render() {
        return (
            <div className={this.state.class}>
                <BhotmHeader
                    entry={this.props.entry}
                    total={this.state.total}
                    mode={this.props.mode}
                />
                <BhotmEntryContent entry={this.props.entry} />
            </div>
        );
    }
}

// Full header for BHotM single entry view
function BhotmHeader(props) {
    // Define header elements, with ternary switches based on certain flags
    // Use either the submission title, or the submittee's name as the title
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
    if (props.mode === "month" || props.mode === "bhoty") {
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
    let place =
        !props.entry.hasBeenJudged || props.unjudged ? (
            <div></div>
        ) : (
            <BhotmPlace
                place={
                    props.mode === "bhoty"
                        ? props.entry.bhotyPlace
                        : props.entry.place
                }
                total={props.total}
                id={props.entry._id}
            />
        );

    // Define month and description
    let month = (
        <Link to={`/bhotm/month/${props.entry.month._id}`}>
            <h5>{props.entry.month.month}</h5>
        </Link>
    );

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
                </div>
                {place}
            </div>
        </div>
    );
}

// Place widget thingo
function BhotmPlace(props) {
    let classN = "text-muted";
    if (props.place === 1) {
        classN = "text-success";
    }
    return (
        <div className="bhotm-header-place">
            <h3 className={classN}>{ordinalSuffix(props.place)}</h3>
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

export default BhotmEntry;
