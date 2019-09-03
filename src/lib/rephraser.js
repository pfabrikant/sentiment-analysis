// a module that exports a method that sends a sentence to Google's translate API
// and returns an array of 8 rephrasings

let Paraphrase = require("paraphrase-sentences");
const key = "AIzaSyB5Emsb3JJSd9rqKUrkaOogRjEA064sDY8";
let paraphrase = new Paraphrase({
    num: 8, // how many variations to generate
    key: key, //API key
    lang: "en",
    removeDuplicates: true
});

exports.rephraseSentence = async function(text) {
    try {
        let results = await paraphrase.get(text);
        return results;
    } catch (err) {
        console.log("Error in rephraseSentence function: ", err.message);
    }
};
