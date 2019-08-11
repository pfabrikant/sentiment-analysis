const express = require('express');
const {analyzeEntitiesOfText, analyzeSentimentOfText} = require ('./naturalLangApi');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieSessionMiddleware= cookieSession({
    secret: 'Death is part of life',
    maxAge: 1000 * 60 * 60 * 24 * 14
});
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

app.post('/submitText', (req,res)=>{
    analyzeSentimentOfText(req.body.text).then(data=>{
        console.log("data returned from analyzeSentimentOfText: ", data);
        res.json(data);
    }).catch(err=>console.log("Error in POST /submitText: ",err.message));
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
