import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {logInId, updateHistory, updateUsername, } from './actions';
import {Link} from 'react-router-dom';

export function Header (params){
    const loggedIn = useSelector (state=>state&&state.logInId);
    const dispatch = useDispatch();
    return (<div className="header">
        <Link to="/"><div className="logo"><h2>senti<span>M</span>app</h2></div></Link>
        <div className="navbar">
            {!loggedIn&& <React.Fragment><Link to="/login"><h4 >login </h4></Link>
                <Link to="/register"><h4> register </h4></Link></React.Fragment>
            }
            {params.match.url!='/'&&<Link to="/"><h4 > Sentiment Analysis </h4></Link>}
            {params.match.url!='/about'&&<Link to="/about"><h4 >  About </h4></Link>}
            {loggedIn&& <React.Fragment>
                {params.match.url!='/history'&&<Link to="/history"><h4 > My History </h4></Link>}
                <Link to="/"><h4 onClick={()=>{
                    dispatch(logInId(null));
                    dispatch(updateHistory(null));
                    dispatch(updateUsername(null));
                }}> logout</h4> </Link></React.Fragment>}
        </div>
    </div>);
}
