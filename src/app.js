import React, {useEffect, createRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateEvaluation, updateValueOfEvaluation, currentValueOfTextArea} from './actions';
import instance from './lib/axios';
import Slider from 'react-input-slider';

export default function App (){
    const dispatch= useDispatch();
    const highlights = createRef();
    const textArea = createRef();
    const inputText = useSelector (state=>state&&state.currValOfTextArea);
    const textEvaluation = useSelector (state=>state&&state.evaluation);
    const valueOfEvaluation = useSelector (state=> state&&state.valueOfEvaluation);
    var highlightedText;


    //calculating the general sentiment of the document by assesing both sentiment and magnitude of the document
    let valOfEv;
    useEffect(()=>{
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
        }
        dispatch(updateValueOfEvaluation(valOfEv));
        highlightedText= function (){
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
            positiveSentences.forEach(sentence=>string.replace(sentence,`<mark className="positive">${sentence}</mark>`));
            string.replace();

        };
    },[textEvaluation]);


    function handleInput (e) {
        dispatch(currentValueOfTextArea(e.target.value));

        //         highlightedText = applyHighlights(inputText);
        //     }
        //
        //     function applyHighlights (text){
        // if (!textEvaluation){
        //         return text;
        //     } else {
        //
        //     }

    }
    function submitText (){
        instance.post('/submitText', {text:inputText}).then(({data})=>{
            dispatch(updateEvaluation(data));

        });
    }

    function handleScroll (){
        const scrollTop = textArea.scrollTop();
        highlights.scrollTop(scrollTop);
    }
    return (
        <div>
            <h1>SentimentApp</h1>
            <div className="container">
                <div className="backdrop">
                    <div className="highlights" ref={highlights}>{highlightedText}
                    </div>
                </div>
                <textarea onChange={e=>handleInput(e)} onScroll={handleScroll} ref={textArea} data-gramm_editor="false"></textarea>
            </div>
            <button onClick={submitText}>Submit text</button>
            {textEvaluation&&
            <div className="resultsDiv">
                <h2> Your text appears to have a {valueOfEvaluation} sentiment </h2>
                <h3> The overall sentiment score of the text is {textEvaluation.documentSentimentScore} [range between -1 (very negative) and 1 (very positive)] while the overall magnitude (emotional intensity) of your text is {textEvaluation.documentSentimentMagnitude} [relative to the document&apos;s length]</h3>
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
                <h3>Sentences that have a particularly high or low sentiment score:</h3>
                {textEvaluation.sentences.map(sentence=>{
                    if (sentence.sentenceSentiment<-0.15){
                        return (<p key={sentence.sentenceId}>The sentence: &quot;<mark className="negative">{sentence.sentenceText} </mark>&quot; --- has a sentinent score of {sentence.sentenceSentiment} and a magnitude score of {sentence.sentenceMagnitude} </p>);
                    } else if (sentence.sentenceSentiment>0.15){
                        return (<p key={sentence.sentenceId}>The sentence: &quot;<mark className="positive">{sentence.sentenceText} </mark>&quot; --- has a sentinent score of {sentence.sentenceSentiment} and a magnitude score of {sentence.sentenceMagnitude} </p>);
                    } else { return; }
                })}
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

            </div>}
        </div>

    );
}
