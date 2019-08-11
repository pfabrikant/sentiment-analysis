import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateText} from './actions';
import instance from './lib/axios';

export default function App (){
    let val;
    const dispatch= useDispatch();
    function submitText (){
        dispatch(updateText(val));
        instance.post('/submitText', {text:val}).then((results)=>{
            console.log(results);

        });
    }
    return (
        <div>
            <h1>SentimentApp</h1>
            <textarea onChange={(e)=>{val=e.target.value;}}></textarea>
            <button onClick={submitText}>Submit text</button>
        </div>

    );
}
