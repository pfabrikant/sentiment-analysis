import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {login, register, logInId, getHistory, updateHistory, updateUsername} from './actions';
import {Link} from 'react-router-dom';
export function Header (){
    const userName = useSelector (state=>state&&state.userName);
    const loggedIn = useSelector (state=>state&&state.logInId);
    const openLogIn = useSelector (state=>state&&state.login);
    const openRegistration = useSelector (state=> state&&state.register);
    const history = useSelector (state=> state&&state.getHistory);
    const dispatch = useDispatch();

    return (<div className="header">
        <Link to="/"><div className="logo" onClick={()=>dispatch(getHistory(false))}><h2>SentiMapp</h2></div></Link>
        <div className="navbar">
            {!loggedIn&& !openLogIn&& !openRegistration && <React.Fragment><Link to="/login"><h4 onClick={()=>dispatch(login(true))}>login |</h4></Link>
                <Link to="/register"><h4 onClick={()=>dispatch(register(true))}>| register </h4></Link></React.Fragment>
            }
            {loggedIn&& <React.Fragment>
                {!history&& <Link to="/history"><h4 onClick={()=>dispatch(getHistory(true))}>{userName}&apos;s SentiMapp history |</h4></Link>}
                {history&& <Link to="/"><h4 onClick={()=>dispatch(getHistory(false))}> Sentiment Analysis |</h4></Link>}
                <h4 onClick={()=>{
                    dispatch(login(false));
                    dispatch(logInId(null));
                    dispatch(register(false));
                    dispatch(getHistory(false));
                    dispatch(updateHistory(null));
                    dispatch(updateUsername(null));
                }}>| logout</h4> </React.Fragment>}
        </div>
    </div>);
}
