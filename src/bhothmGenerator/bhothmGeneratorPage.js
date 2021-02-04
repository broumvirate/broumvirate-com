import React, { useState, useEffect } from "react";
import { handleFetchErrors } from "../utils/helpers";
import { Link, Redirect } from "react-router-dom";
import Loader from "react-loader-spinner";

const BhothmGeneratorPage = (props) => {
    const [meme, setMeme] = useState({url: ""});

    useEffect(() => {
        getMeme().then(setMeme);
    }, []);

    return (
        <div className="container">
            <div className="d-flex flex-column align-items-center">
                <h2 className="m-3">BHOTHM Generator</h2>
                <div className="mb-2">
                    <button
                        className="btn btn-success"
                        onClick={() => {
                            setMeme({    url: ""    });
                            getMeme().then(setMeme);
                        }}
                    >
                        <h6>Generate Another</h6>
                    </button>
                    <Link
                        to={{
                            pathname: "/bhotm/entry/new",
                            search: `?link=${meme?.url}`,
                        }}
                        className="btn btn-secondary mx-2"
                    >
                        <h6>Submit To BHotM</h6>
                    </Link>
                    <Link to="/bhotm/bhothm-generator/add" className="btn btn-secondary"><h6>Add BHOTHMtext</h6></Link>
                </div>
                {meme.url !== "" ? (
                    <img src={meme.url}></img>
                ) : (
                    <div className="my-5">
                        <Loader
                            type="TailSpin"
                            color="#00BFFF"
                            height={80}
                            width={80}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const getMeme = () => {
    let url = "/api/bhothm";
    return fetch(url).then(handleFetchErrors);
};

export default BhothmGeneratorPage;
