let Paraphrase = require('paraphrase-sentences');
const key ='AIzaSyB5Emsb3JJSd9rqKUrkaOogRjEA064sDY8';
let paraphrase = new Paraphrase({
    num: 8, // how many variations to generate
    key: key, // your API key
    lang: 'en', // language of your source sentence in the Google Translate format
    removeDuplicates: true, // whether to remove duplicate sentences in the results
});

exports.rephraseSentence=  async function (text) {
    try {
        let results = await paraphrase.get(text);
        return results;
    } catch (err){
        console.log("Error in rephraseSentence function: ", err.message);
    }
};
