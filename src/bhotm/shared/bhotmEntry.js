import BhotmEntryContent from "./bhotmEntryContent";
import React from "react";
import { Link } from "react-router-dom";

// Full entry, including header and content. Single page entry info
class BhotmEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            class: `bhotm-entry ${
                this.props.entry.place === 1 ? "bhotm-winner" : null
            }`,
        };
    }
    render() {
        return (
            <div className={this.state.class}>
                <BhotmHeader
                    entry={this.props.entry}
                    mode={this.props.mode}
                    unjudged={this.props.unjudged}
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
                isBhoty={props.mode === "bhoty"}
            />
        );

    // Define month and description
    let month = props.entry.month ? (
        <Link to={`/bhotm/month/${props.entry.month._id}`}>
            <h5>{props.entry.month.month}</h5>
        </Link>
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
                </div>
                {place}
            </div>
        </div>
    );
}

// Place widget thingo
function BhotmPlace(props) {
    let classN = "text-muted";
    let inside = ordinalSuffix(props.place);
    if (props.place === 1 && !props.isBhoty) {
        classN = "text-success";
    }
    if (props.isBhoty) {
        inside = `${props.place} votes`;
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

export default BhotmEntry;
