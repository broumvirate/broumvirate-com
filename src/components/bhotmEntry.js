import BhotmEntryContent from "./bhotmEntryContent.js";

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
        place = <BhotmPlace place={props.entry.place} total={props.total} />;
    }

    return (
        <div>
            <div className="bhotm-header">
                <div className="bhotm-header-text">
                    {heading}
                    <h6 className="text-muted mt-0">
                        {props.entry.entryDescription}
                    </h6>
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

function ordinalSuffix(i) {
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

// Full entry, including header and content. Single page entry info
class BhotmEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: props.total,
        };

        if (!props.total) {
            this.state = { total: this.props.entry.month.submissions.length };
        }

        if (this.props.entry.place === 1) {
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
                />
                <BhotmEntryContent entry={this.props.entry} />
            </div>
        );
    }
}

export default BhotmEntry;
