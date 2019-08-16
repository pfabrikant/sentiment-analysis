const express = require('express');
const {analyzeEntitySentimentOfText, analyzeSentimentOfText} = require ('./naturalLangApi');
const app = express();
const compression = require('compression');
const bc = require('./src/lib/bcrypt');
const db = require('./src/lib/dataBase');
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
        if (req.session.loginId){
            db.updateHistory(req.session.loginId,clean, Number(results.documentSentimentScore)).then(()=>{

            }).catch(err=>console.log("Error in db.updatehistory in POST /submitText: ",err.message));
        }
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

app.post('/register', (req,res)=>{
    bc.getHash(req.body.password).then((hash) => {
        return db.insertUser(req.body.username, req.body.email, hash);
    }).then(({rows}) => {
        req.session.loginId = rows[0].id;
        req.session.username= req.body.username;
        res.json({loggedIn:true,
            userId:rows[0].id });
    }).catch(err=>{
        console.log('error in POST /register: ', err.message);
        res.json({loggedIn:false});
    });
});

app.post('/login', (req, res) => {
    let idInQuestion;
    console.log(req.body.username);
    db.getPassword(req.body.username).then(({rows}) => {

        idInQuestion = rows[0].id;
        return bc.compareHash(req.body.password, rows[0].password);
    }).then(() => {
        req.session.loginId =idInQuestion;
        req.session.username= req.body.username;
        res.json({loggedIn:true,
            userId:idInQuestion
        });

    }).catch((err) => {
        console.log('Error in POST /login route: ', err.message);
        res.json({loggedIn:false});
    });
});

app.get('/id', (req,res)=>{
    if (req.session.loginId){
        res.json({id:req.session.loginId, username:req.session.username});
    }
});

app.get('/getHistory/:id', (req,res)=>{
    db.getHistory(req.params.id).then(({rows})=>{
        res.json(rows);
    }).catch(err=>console.log("Error in GET /getHistory: ", err.message));
});
app.get('/public/:filename', (req,res)=>{
    res.sendFile(__dirname + '/public'+req.params.filename);
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});
