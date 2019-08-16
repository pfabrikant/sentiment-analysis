
import React, {useEffect} from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import {Header} from './header';
import {Main} from './main';
import {Login, Register} from './registration';
import {History} from './history';
import {About} from './about';
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
        <div className="html">
            <div className="body">
                <BrowserRouter>
                    <Route path='*' component={Header}/>
                    <Route exact path="/" component={Main}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/history" component={History}/>
                    <Route exact path="/about" component={About}/>
                </BrowserRouter>
            </div>
            <footer><p>© <a href="https://github.com/pfabrikant">Eli Fabrikant</a> - 2019. Powered by Google&apos;s <a href="https://cloud.google.com/natural-language/">Natural Language API</a> and <a href="https://cloud.google.com/translate/">Translation API</a>.&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Background Photo by <a href="https://www.instagram.com/knownasovan/"> OVAN </a></p></footer>
        </div>

    );
}
