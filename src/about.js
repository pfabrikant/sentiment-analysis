import React from 'react';

export function About (){
    return (<div className="about">
        <h2>About sentiMapp</h2>
        <h5>What does the sentiMapp do?</h5>
        <p>This application provides a sentiment analysis for any text up to a length of 10,000 characters. After the user submitted a text, the sentiMapp will deliever a detailed analysis of the sentiment of the text as a whole, its sentences and its entities (proper nouns and common nouns).
        The sentences that received a particularly high or low sentiment score will be highlighted (green for positive, red for negative). Upon click on one of the highlighted sentences, further information about the sentence will be presented as well as a list of alternative rephrasings to the original sentence that scored a more neutral grade.</p>
        <p> When the user chooses a new rephrasing, her choice will be automatically inserted into the text and a new sentiment analysis will be performed.</p>

        <h5>Which languages does the application support?</h5>
        <p>Currently the application supports sentiment analysis and sentence suggestions in English, French, German, Italian, Japanese, Korean, Portuguese, Russian, Spanish and Chinese </p>


        <h5>Sentiment Analysis</h5>
        <p>This application is powered by the <a href="https://cloud.google.com/natural-language/">Google Natural Language API</a>. It is using machine learning to reveal the structure and meaning of text. Specifically, sentiMapp uses its Sentiment Analysis and Entity Analysis features. </p>
        <p>The sentiment analysis calculates the &apos;sentiment score&apos; for the entire text and for each of the sentences constructing it. It is important to note that the tool is still under active development and therefore not very &apos;emotionally intelligent&apos;. Currently it can only analyse emotions on the spectrum of positivity-negativity. This means that saddness and anger, for example, would both be categorized as negative sentiments.</p>
        <p>In addition to the sentiment score, the text and sentences also receive a magnitude score which reflects their emotional charge, regardless of sentiment. This extra score helps sentiMapp to callibrate its analysis of emotionally mixed texts.</p>

    </div>);




}
