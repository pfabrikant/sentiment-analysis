const express = require('express');
const {analyzeEntitySentimentOfText, analyzeSentimentOfText} = require ('./naturalLangApi');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieSessionMiddleware= cookieSession({
    secret: 'Death is part of life',
    maxAge: 1000 * 60 * 60 * 24 * 14
});
const {rephraseSentence} = require ('./src/lib/rephraser');
const sanitizeHtml = require('sanitize-html');
const cookieParser = require ('cookie-parser');
const csurf = require ('csurf');
app.use(cookieParser());
app.use(cookieSessionMiddleware);
app.use(bodyParser.json());
app.use(compression());
//csurf middleware
app.use(csurf());
app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});



if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use('/public/:fileName', (req,res)=>{
    res.sendFile(__dirname+'/public/'+ req.params.fileName);

});
app.post('/submitText', (req,res)=>{
    var results;
    const clean = sanitizeHtml(req.body.text);
    analyzeSentimentOfText(clean).then(data=>{
        results=data;
        return analyzeEntitySentimentOfText(req.body.text);
    }).then (moreResults=>{
        results.entitiesAnalysis=moreResults;
        res.json(results);
    }).catch(err=>console.log("Error in POST /submitText: ",err.message));
});
app.post('/getRephrasing', (req,res)=>{
    rephraseSentence(req.body.text).then(results=>{
        return analyzeSentimentOfText(results.join(' ').replace( /,/g,''));
    }).then(data=>{
        let list = data.sentences.filter(sentence=>Math.abs(sentence.sentenceSentiment)<Math.abs(req.body.score));
        res.json(list);
    }).catch(err=>console.log("Error in POST /getRephrasing: ", err.message));
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
