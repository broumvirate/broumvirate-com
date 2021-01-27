import React, { useState, useEffect } from "react";
import { handleFetchErrors } from "../utils/helpers";
import { Link, Redirect } from "react-router-dom";

const BhothmGeneratorPage = (props) => {
    const [meme, setMeme] = useState({});

    useEffect(() => {
        getMeme().then(setMeme);
    }, []);

    return (
        <div className="container">
            <div className="d-flex flex-column align-items-center">
                <h2 className="m-3">BHOTHM Generator</h2>
                <img src={meme.url}></img>
                <div className="mt-2">
                    <button
                        className="btn btn-success"
                        onClick={() => {
                            setMeme("");
                            getMeme().then(setMeme);
                        }}
                    >
                        <h6>Generate Another</h6>
                    </button>
                    <Link
                        to={{
                            pathname: "/bhotm/entry/new",
                            search: `?link=${meme.url}`,
                        }}
                        className="btn btn-secondary mx-2"
                    >
                        <h6>Submit To BHotM</h6>
                    </Link>
                </div>
            </div>
            <Link to="/bhotm/bhothm-generator/add">Add BHOTHMtext</Link>
        </div>
    );
};

const getMeme = () => {
    let url = "/api/bhothm";
    return fetch(url).then(handleFetchErrors);
};

export default BhothmGeneratorPage;
