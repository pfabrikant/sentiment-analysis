import React, {useEffect, useState, createRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateEvaluation, updateValueOfEvaluation, currentValueOfTextArea, updateHighlightedText, updateRephrasing} from './actions';
import instance from './lib/axios';
import Slider from 'react-input-slider';

export function Main (){
    const dispatch= useDispatch();
    const highlights = createRef();
    const sentencesDetailedResultsRef = createRef();
    const entitiesDetailedResultsRef = createRef();
    const textArea = createRef();
    const inputText = useSelector (state=>state&&state.currValOfTextArea);
    const textEvaluation = useSelector (state=>state&&state.evaluation);
    const valueOfEvaluation = useSelector (state=> state&&state.valueOfEvaluation);
    const highlightedText = useSelector (state=> state&&state.highlightedText);
    const rephrasing = useSelector (state=> state && state.rephrasing);
    const rephrasingId = useSelector (state=> state&& state.rephrasingId);
    const [sentencesDetailedResults, setSentencesDetailedResults]= useState();
    const [entitiesDetailedResults, setEntitiesDetailedResults]= useState();

    var composeHighlightedText = function (){
        let string= inputText.slice();
        let positiveSentences =[];
        let negativeSentences=[];
        textEvaluation.sentences.map(sentence=>{
            if (sentence.sentenceSentiment>0.15){
                positiveSentences.push(sentence.sentenceText);
            }
            if (sentence.sentenceSentiment<-0.15){
                negativeSentences.push(sentence.sentenceText);
            }
        });
        positiveSentences.forEach(sentence=>string=string.replace(sentence,`<mark class="positive">${sentence}</mark>`));
        negativeSentences.forEach(sentence=>string=string.replace(sentence,`<mark class="negative">${sentence}</mark>`));
        dispatch(updateHighlightedText(string));
    };



    let valOfEv;
    useEffect(()=>{
        //calculating the general sentiment of the document by assesing both sentiment and magnitude of the document
        if (textEvaluation){
            // if documentSentimentScore is close to 0
            if(Math.abs(textEvaluation.documentSentimentScore)<0.2){
                if (0<Math.abs(textEvaluation.documentSentimentMagnitude-Math.abs(textEvaluation.documentSentimentScore))<0.5){
                    valOfEv= "neutral";
                } else {
                    valOfEv= "mixed";
                }
            } else {
                // if documentSentimentScore is high
                if (textEvaluation.documentSentimentScore>=0.2){
                    valOfEv= "clearly positive";
                } else {
                    valOfEv= "clealry negative";
                }
            }
            dispatch(updateValueOfEvaluation(valOfEv));
            // function that returns the `decorated`string for the background div to the textarea
            composeHighlightedText();
        }

    },[textEvaluation]);

    // upon change of the textarea
    function handleInput (e) {
        dispatch(currentValueOfTextArea(e.target.value));
        if (textEvaluation){
            composeHighlightedText();
        } else {
            dispatch(updateHighlightedText(e.target.value));
        }
    }

    // upon click on the submit button
    function submitText (){
        instance.post('/submitText', {text:inputText}).then(({data})=>{
            dispatch(updateEvaluation(data));
        });
        setSentencesDetailedResults(false);
        setEntitiesDetailedResults(false);
    }
    // align textarea and highlights div upon scrolling
    function handleScroll (){
        const scrollTop = textArea.scrollTop();
        highlights.scrollTop(scrollTop);
    }
    // upon click on a highlighted sentence in the textarea
    function handleClick (e){
        if (inputText){
            e.preventDefault();
            let start = e.target.selectionStart;
            let sample= inputText.slice(start, start+6);
            if (textEvaluation){
                textEvaluation.sentences.map(sentence=>{
                    if(sentence.sentenceText.includes(sample)){
                        instance.post('/getRephrasing', {text:sentence.sentenceText, score:sentence.sentenceSentiment}).then(({data})=>{
                            dispatch(updateRephrasing(sentence.sentenceId,data));
                        }).catch(err=>console.log("Error in handleClick: ",err.message));
                    }
                });
            }
        }
    }
    // upon click on a sentence suggestion in the alternative- rephrasings div
    function insertRephrase(text){
        let sentenceToReplace= textEvaluation.sentences.filter(sentence=>sentence.sentenceId==rephrasingId)[0].sentenceText;
        let newInputText= inputText.replace(sentenceToReplace,text);
        dispatch(currentValueOfTextArea(newInputText));
        composeHighlightedText();
        dispatch(updateRephrasing(null, null));
    }

    function openDetails (bool){
        setSentencesDetailedResults(bool);
        sentencesDetailedResultsRef.current&&sentencesDetailedResultsRef.current.scrollIntoView({behavior:'smooth'});
    }

    return (
        <div>
            <div className="container">
                <div className="backdrop">
                    <div className="highlights" ref={highlights} dangerouslySetInnerHTML={{__html:highlightedText}}>
                    </div>
                </div>
                <textarea onChange={e=>handleInput(e)} onScroll={handleScroll} onClick={e=>handleClick(e)} ref={textArea} value={inputText} data-gramm_editor="false"></textarea>
                {rephrasing && rephrasing.length>0 &&<div className="rephrasing"> <span onClick={()=>dispatch(updateRephrasing(null, null))}>X</span>
                    {rephrasing.map(sentence=>{
                        return (<p onClick={()=>insertRephrase(sentence.sentenceText)} key={sentence.sentenceId}> {sentence.sentenceText
                        } </p>);
                    })
                    }
                </div>}
            </div>
            <button onClick={submitText}>Submit text</button>
            {textEvaluation&&
        <div className="resultsDiv">
            <h2> Your text appears to have a {valueOfEvaluation} sentiment </h2>
            <div className="flex">  <h3> Negative </h3><Slider id="slider"
                axis="x"
                x={textEvaluation.documentSentimentScore}
                xmax={1} xmin={-1} disabled={true} xstep={2} styles={{
                    active: {
                        backgroundColor: 'transparent'
                    },
                    thumb: {
                        width: 10,
                        height: 10,
                        opacity: 1
                    },
                    disabled: {
                        opacity: 1
                    }
                }}
            /> <h3> positive </h3> </div>

            <button onClick={()=>openDetails(true)}>Detailed information about the text and selected sentences</button>

            <button onClick={()=>{setEntitiesDetailedResults(true);
                entitiesDetailedResultsRef.current && entitiesDetailedResultsRef.current.scrollIntoView({behavior:'smooth'});
            }}>Detailed information about selected entities from your text</button>
            {sentencesDetailedResults&& <React.Fragment>
                <h3> The overall sentiment score of the text is {textEvaluation.documentSentimentScore} [range between -1 (very negative) and 1 (very positive)] while the overall magnitude (emotional intensity) of your text is {textEvaluation.documentSentimentMagnitude} [relative to the document&apos;s length]</h3>
                <h3>Sentences that have a particularly high or low sentiment score:</h3>
                {textEvaluation.sentences.map(sentence=>{
                    if (sentence.sentenceSentiment<-0.15){
                        return (<p key={sentence.sentenceId}>The sentence: &quot;<mark className="negative">{sentence.sentenceText} </mark>&quot; --- has a sentinent score of {sentence.sentenceSentiment} and a magnitude score of {sentence.sentenceMagnitude} </p>);
                    } else if (sentence.sentenceSentiment>0.15){
                        return (<p key={sentence.sentenceId}>The sentence: &quot;<mark className="positive">{sentence.sentenceText} </mark>&quot; --- has a sentinent score of {sentence.sentenceSentiment} and a magnitude score of {sentence.sentenceMagnitude} </p>);
                    } else { return; }
                })}
                <div className="ref" ref={sentencesDetailedResultsRef}></div>
            </React.Fragment>}
            {entitiesDetailedResults&& <React.Fragment>
                <h3> Relevant nouns in the text that have a particularly high or low sentiment score:</h3>
                {textEvaluation.entitiesAnalysis&&
                textEvaluation.entitiesAnalysis.map(entity=>{
                    if (entity.entitySentimentScore>0.1){
                        return (<p key={entity.entityName}>The noun: &quot;<mark className="positive"> {entity.entityName} </mark>&quot; --- has a sentiment score of {entity.entitySentimentScore} and a magnitude score of {entity.entitySentimentMagnitude} </p>);
                    }
                    if (entity.entitySentimentScore<-0.1){
                        return (<p key={entity.entityName}>The noun: &quot;<mark className="negative">{entity.entityName} </mark>&quot; --- has a sentiment score of {entity.entitySentimentScore} and a magnitude score of {entity.entitySentimentMagnitude} </p>);
                    }
                })
                }
                <div className="ref" ref={entitiesDetailedResultsRef}></div>
            </React.Fragment>}
        </div>
            }
        </div>
    );
}
