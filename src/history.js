import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateHistory } from "./actions";
import instance from "./lib/axios";

export function History() {
    const userName = useSelector(state => state && state.userName);
    const id = useSelector(state => state && state.logInId);
    const history = useSelector(state => state && state.history);

    const dispatch = useDispatch();
    useEffect(() => {
        if (id) {
            instance
                .get(`/getHistory`)
                .then(({ data }) => {
                    dispatch(updateHistory(data));
                })
                .catch(err =>
                    console.log(
                        "Error in useEffect function in History component: ",
                        err.message
                    )
                );
        }
    }, [id]);
    return (
        <div className="history">
            <h2>
                Here are your latest sentiment analysis requests, {userName}:
            </h2>
            <div className="flexit">
                <h4>Score</h4>
                <h4>Text</h4>
            </div>
            <div className="sentim-analysis-requests">
                {history &&
                    history.map(obj => {
                        if (obj.sentiment > 0.2) {
                            return (
                                <div className="analysis-request" key={obj.id}>
                                    <h3>{obj.sentiment}</h3>
                                    <mark className="positive">
                                        <h4>{obj.input_text}</h4>
                                    </mark>{" "}
                                </div>
                            );
                        } else if (obj.sentiment < -0.2) {
                            return (
                                <div className="analysis-request" key={obj.id}>
                                    <h3>{obj.sentiment}</h3>
                                    <mark className="negative">
                                        <h4>{obj.input_text}</h4>
                                    </mark>{" "}
                                </div>
                            );
                        } else {
                            return (
                                <div className="analysis-request" key={obj.id}>
                                    <h3>{obj.sentiment}</h3>
                                    <h4>{obj.input_text}</h4>{" "}
                                </div>
                            );
                        }
                    })}
            </div>
        </div>
    );
}
