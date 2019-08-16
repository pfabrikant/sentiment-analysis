import React, {useState} from 'react';
import instance from './lib/axios';
import {useDispatch} from 'react-redux';
import {updateLogInId, updateUsername} from './actions';
import { Redirect } from 'react-router';
import {Link} from 'react-router-dom';

export function Register (){

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [repeatPassword, setRepeatPassword] = useState();
    const [error, setError] = useState();
    const [serverError, setServerError] = useState();
    const [redirect, setRedirect] = useState();
    const dispatch = useDispatch();


    function registerUser (){
        if (password==repeatPassword){
            instance.post('/register',{username:username, email:email, password:password}).then(({data})=>{
                if (data.loggedIn){
                    dispatch(updateLogInId(data.userId));
                    dispatch(updateUsername(username));
                    setRedirect(true);
                } else {
                    setServerError(true);
                }
            }).catch(err=>console.log("Error in registerUser function in Register: ",err.message));
        } else {
            setError(true);
        }
    }


    if (redirect){
        return <Redirect to='/'/>;
    } else {
        return (<div className="registration">
            <h3> Registration</h3>
            {error&&<h3 className="error">Unfortunately your passwords did not match. Please try again!</h3>}
            {serverError&&<h3 className="error">There was a problem with the registration. Please try again!</h3>}
            <input onChange={e=>setUsername(e.target.value)} type="text" name="username" placeholder="username"/>
            <input onChange={e=>setEmail(e.target.value)} type="email" name="email" placeholder="email"/>
            <input onChange={e=>setPassword(e.target.value)} type="password" name="password" placeholder="password"/>
            <input onChange={e=>setRepeatPassword(e.target.value)} type="password" name="repeat-password" placeholder="repeat password"/>
            <button onClick={registerUser}>register</button>
            <Link to="/login"><h4>Do you already have an account? Log in here!</h4></Link>

        </div>);
    }
}

export function Login (){
    const [serverError, setServerError] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [redirect, setRedirect] = useState();
    const dispatch = useDispatch();

    function loginUser (){
        instance.post('/login',{username:username, password:password}).then(({data})=>{
            if (data.loggedIn){
                dispatch(updateLogInId(data.userId));
                dispatch(updateUsername(username));
                setRedirect(true);
            } else {
                setServerError(true);
            }
        }).catch(err=>console.log("Error in loginUser function in Login: ",err.message));

    }


    if (redirect){
        return <Redirect to='/'/>;
    } else {
        return (<div className="registration">
            <h2> Log in </h2>

            {serverError&&<h3 className="error">There was a problem with the login. Please try again!</h3>}
            <input onChange={e=>setUsername(e.target.value)} type="text" name="username" placeholder="username"/>
            <input onChange={e=>setPassword(e.target.value)} type="password" name="password" placeholder="password"/>
            <button onClick={loginUser}>Log in</button>
            <Link to="/register"><h4>Still don&apos;t have an account? Register here!</h4></Link>

        </div>);
    }
}
