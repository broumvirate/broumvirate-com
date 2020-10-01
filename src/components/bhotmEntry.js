function BhotmEntryImage(props) {
    return (
        <div>
            <a href={props.fullLink ? props.fullLink : props.link}>
                <img
                    src={props.link}
                    className="img-fluid"
                    alt="BHotM Submission"
                />
            </a>
        </div>
    );
}

function BhotmEntryYoutube(props) {
    // make this do the size properly
    return (
        <div className="text-center m-1 bhotm-video-container">
            <iframe
                src={props.link}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}

// Just the content of a BHotM entry, without title/entrant/place info. Scales.
function BhotmContent(props) {
    let content, fullLink;
    let description = props.entry.entryDescription;
    switch (props.entry.format) {
        case "image":
            content = (
                <BhotmEntryImage
                    link={props.entry.link}
                    fullLink={props.entry.clickLink}
                />
            );
            break;
        case "youtube":
            content = <BhotmEntryYoutube link={props.entry.link} />;
            break;
        case "phrase":
            content = <p className="lead">{props.entry.link}</p>;
            break;
        case "link":
            content = (
                <h2>
                    <a href={props.entry.link}>Link To Entry</a>
                </h2>
            );
            break;

        case "mason":
            description = "Did not submit, is Mason.";
            content = (
                <div>
                    <img
                        src="/img/SmackSonUS1.jpg"
                        class="img-fluid"
                        alt="Mason Gurtler"
                    />
                </div>
            );
            break;
        default:
            content = <p>{props.entry.format}</p>;
    }

    if (props.entry.clickLink) {
        fullLink = (
            <h2 className="text-center">
                <a href={props.entry.clickLink}>Link To Full Entry</a>
            </h2>
        );
    }

    return (
        <div>
            {content}
            {fullLink}
            <h4 className="text-muted mt-2">{description}</h4>
        </div>
    );
}

function BhotmPlace(props) {
    return (
        <div className="bhotmHeaderPlace">
            <p>
                {props.place} / {props.total}
            </p>
        </div>
    );
}

function BhotmHeader(props) {
    let place = <div></div>;
    let heading;
    if (props.entry.entryName) {
        heading = (
            <span className="bhotmHeaderTitle">
                <h1 className="mr-2">{props.entry.entryName}</h1>
                <h3 className="text-muted"> by {props.entry.name}</h3>
            </span>
        );
    } else {
        heading = (
            <span className="bhotmHeaderTitle">
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
            <div className="bhotmHeader">
                <div className="bhotmHeaderText">
                    {heading}
                    <h5>{props.entry.month.month}</h5>
                </div>
                {place}
            </div>
            <div className="bhotmHeaderGrad"></div>
        </div>
    );
}

// Full entry, including header and content. Single page entry info
class BhotmEntry extends React.Component {
    render() {
        return (
            <div>
                <BhotmHeader entry={this.props.entry} />
                <BhotmContent entry={this.props.entry} />
            </div>
        );
    }
}

const _BhotmEntry = BhotmEntry;
export { _BhotmEntry as BhotmEntry };
export { BhotmContent };
