import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    logInId,
    updateHistory,
    updateUsername,
    currentValueOfTextArea,
    deleteEvaluation
} from "./actions";
import { Link } from "react-router-dom";
import instance from "./lib/axios";

export function Header(params) {
    const loggedIn = useSelector(state => state && state.logInId);

    const dispatch = useDispatch();
    return (
        <div className="header">
            <Link to="/">
                <div className="logo">
                    <h2>
                        senti<span>M</span>app
                    </h2>
                </div>
            </Link>
            <div className="navbar">
                {!loggedIn && (
                    <React.Fragment>
                        <Link to="/login">
                            <h4>login </h4>
                        </Link>
                        <Link to="/register">
                            <h4> register </h4>
                        </Link>
                    </React.Fragment>
                )}
                {params.match.url != "/" && (
                    <Link to="/">
                        <h4> Sentiment Analysis </h4>
                    </Link>
                )}
                {params.match.url != "/about" && (
                    <Link to="/about">
                        <h4> About </h4>
                    </Link>
                )}
                {loggedIn && (
                    <React.Fragment>
                        {params.match.url != "/history" && (
                            <Link to="/history">
                                <h4> My History </h4>
                            </Link>
                        )}
                        <Link to="/">
                            <h4
                                onClick={() => {
                                    dispatch(logInId(null));
                                    dispatch(updateHistory(null));
                                    dispatch(updateUsername(null));
                                    dispatch(currentValueOfTextArea(""));
                                    dispatch(deleteEvaluation());

                                    instance
                                        .get("/logout")
                                        .then(({ data }) => {
                                            if (data.logout) {
                                                // // This function will attempt to remove a cookie from all paths.
                                                // var pathBits = location.pathname.split(
                                                //     "/"
                                                // );
                                                // var pathCurrent = " path=";
                                                //
                                                // // do a simple pathless delete first.
                                                // document.cookie =
                                                //     "session= deleted ; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
                                                //
                                                // for (
                                                //     var i = 0;
                                                //     i < pathBits.length;
                                                //     i++
                                                // ) {
                                                //     pathCurrent +=
                                                //         (pathCurrent.substr(
                                                //             -1
                                                //         ) != "/"
                                                //             ? "/"
                                                //             : "") + pathBits[i];
                                                //     document.cookie =
                                                //         "session= deleted ; expires=Thu, 01-Jan-1970 00:00:01 GMT;" +
                                                //         pathCurrent +
                                                //         ";";
                                                // }
                                            }
                                        })
                                        .catch(err =>
                                            console.log(
                                                "Error in logout route in Header component: ",
                                                err.message
                                            )
                                        );
                                }}
                            >
                                {" "}
                                logout
                            </h4>{" "}
                        </Link>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
}
