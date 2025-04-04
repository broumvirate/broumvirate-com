import React from "react";

// Just the content of a BHotM entry, without title/entrant/place info. Scales.
function BhotmEntryContent(props) {
    let content, fullLink;
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
            content = <h2 className="text-center">{props.entry.link}</h2>;
            break;
        case "link":
            content = (
                <h2 className="text-center">
                    <a href={props.entry.link}>Link To Entry</a>
                </h2>
            );
            break;

        case "mason":
            content = (
                <div>
                    <img
                        src="https://broumvirate.s3.us-east-2.amazonaws.com/img/SmackSonUS1.jpg"
                        className="img-fluid bhotm-image"
                        alt="Mason Gurtler"
                    />
                </div>
            );
            break;
        case "deleted":
            content = (
                <p>This entry has been deleted by the admins. :bencry:</p>
            );
            break;
        case "restricted":
            content = (
                <BhotmEntryImage
                    link="https://broumvirate.s3.us-east-2.amazonaws.com/img/RestrictedBhotm.jpg"
                    fullLink="/login"
                />
            );
            fullLink = (
                <h2 className="text-center">
                    <a href="/login">Login to view entry</a>
                </h2>
            );
            break;
        case "audio":
            content = (
                <audio controls style={{ width: "100%" }}>
                    <source src={props.entry.link} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                </audio>
            );
            break;
        case "video":
            content = (
                <video controls style={{ width: "100%" }}>
                    <source src={props.entry.link} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
            break;
        default:
            content = (
                <p>
                    Ben didn't code the {props.entry.format} format because he
                    sucks. Eat him.
                </p>
            );
    }

    if (props.entry.clickLink) {
        fullLink = (
            <h2 className="text-center">
                <a href={props.entry.clickLink}>Link To Full Entry</a>
            </h2>
        );
    }

    return (
        <div className="bhotm-entry-content">
            {content}
            {fullLink}
        </div>
    );
}

function BhotmEntryImage(props) {
    return (
        <div>
            <a href={props.fullLink ? props.fullLink : props.link}>
                <img
                    src={props.link}
                    className="img-fluid bhotm-image"
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
                // allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}

export default BhotmEntryContent;
