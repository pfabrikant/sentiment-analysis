
import React, {useEffect} from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import {Header} from './header';
import {Main} from './main';
import {Login, Register} from './registration';
import {History} from './history';
import instance from './lib/axios';
import {useDispatch} from 'react-redux';
import {updateLogInId, updateUsername} from './actions';

export default function App (){
    const dispatch = useDispatch();
    //make sure React knows that a user is logged in if page reloads
    useEffect(()=>{
        instance.get('/id').then(({data})=>{
            if(data.id){
                dispatch(updateLogInId(data.id));
                dispatch(updateUsername(data.username));
            }
        }).catch(err=>console.log("Error in useEffect in App: ", err.message));
    },[]);
    return (
        <div>
            <BrowserRouter>
                <Header />
                <Route exact path="/" component={Main}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/history" component={History}/>
            </BrowserRouter>
        </div>

    );
}
