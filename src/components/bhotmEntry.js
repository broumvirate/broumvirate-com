import { BhotmEntryContent } from "./bhotmEntryContent.js";

// Full header for BHotM single entry view
function BhotmHeader(props) {
    let place = <div></div>;
    let heading;
    if (props.entry.entryName) {
        heading = (
            <span className="bhotm-header-title">
                <h1 className="mr-2">{props.entry.entryName}</h1>
                <h3 className="text-muted"> by {props.entry.name}</h3>
            </span>
        );
    } else {
        heading = (
            <span className="bhotm-header-title">
                <h1 className="mr-2">{props.entry.name}</h1>
            </span>
        );
    }

    if (props.entry.hasBeenJudged) {
        place = (
            <BhotmPlace
                place={props.entry.place}
                total={props.entry.month.submissions.length}
            />
        );
    }

    return (
        <div>
            <div className="bhotm-header">
                <div className="bhotm-header-text">
                    {heading}
                    <h5>{props.entry.month.month}</h5>
                </div>
                {place}
            </div>
            <div className="bhotm-header-gradient"></div>
        </div>
    );
}

// Place widget thingo
function BhotmPlace(props) {
    return (
        <div className="bhotm-header-place">
            <p>
                {props.place} / {props.total}
            </p>
        </div>
    );
}

// Full entry, including header and content. Single page entry info
class BhotmEntry extends React.Component {
    render() {
        return (
            <div className="bhotm-entry">
                <BhotmHeader entry={this.props.entry} />
                <BhotmEntryContent entry={this.props.entry} />
            </div>
        );
    }
}

const _BhotmEntry = BhotmEntry;
export { _BhotmEntry as BhotmEntry };
