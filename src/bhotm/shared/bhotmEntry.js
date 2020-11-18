import BhotmEntryContent from "./bhotmEntryContent";
import React from "react";
import BhotmHeader from "./bhotmHeader";

// Full entry, including header and content. Single page entry info
const BhotmEntry = (props) => {
    return (
        <div
            className={`bhotm-entry ${
                props.entry.place === 1 ? "bhotm-winner" : ""
            }`}
        >
            <BhotmHeader {...props} />
            <BhotmEntryContent entry={props.entry} />
        </div>
    );
};

export default BhotmEntry;
