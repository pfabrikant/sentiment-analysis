import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateHistory} from './actions';
import instance from './lib/axios';

export function History (){
    const userName = useSelector (state=>state&&state.userName);
    const id = useSelector (state=>state&&state.logInId);
    const history = useSelector (state=> state&&state.history);
    const getHistory = useSelector (state=> state&&state.getHistory);

    const dispatch= useDispatch();
    useEffect(()=>{
        if (id){
            instance.get(`/getHistory/${id}`).then(({data})=>{
                dispatch(updateHistory(data));
            }).catch(err=>console.log("Error in useEffect function in History component: ", err.message));
        }
    },[id]);
    return (<div className="history">
        {getHistory&& <React.Fragment> <h2>Here are your latest sentiment analysis requests, {userName}:</h2>
            <div className="sentim-analysis-requests">
                {history&&history.map(obj=>{
                    if (obj.sentiment>0.2){
                        return (<div className="analysis-request" key={obj.id}>
                            <mark className="positive"><h3>{obj.sentiment}</h3>
                                <h4>{obj.input_text}</h4></mark> </div>);
                    } else if (obj.sentiment<-0.2){
                        return (<div className="analysis-request" key={obj.id}>
                            <mark className="negative"><h3>{obj.sentiment}</h3>
                                <h4>{obj.input_text}</h4></mark> </div>);
                    } else {
                        return (<div className="analysis-request" key={obj.id}>
                            <h3>{obj.sentiment}</h3>
                            <h4>{obj.input_text}</h4> </div>);
                    }
                })}
            </div>
        </React.Fragment>}
    </div>);
}
