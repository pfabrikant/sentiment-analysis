// // Imports the Google Cloud client library
// const {Storage} = require('@google-cloud/storage');
//
// // Creates a client
// const storage = new Storage();
// const bucketName = 'sentiment-analysis-app';
//
// async function createBucket() {
//   // Creates the new bucket
//   await storage.createBucket(bucketName);
//   console.log(`Bucket ${bucketName} created.`);
// }
//
// createBucket();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();



exports.analyzeEntitiesOfText= async function (text
) {
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };
    const [result] = await client.analyzeEntities({document});
    const entities = result.entities;
    const data = {};
    entities.forEach(entity => {
        data[entity.name]=[entity.type, entity.salience];
    });
    return data;
};

exports.analyzeSentimentOfText = async function (text){
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };
    try {
        const [result] = await client.analyzeSentiment({document: document});
        const sentiment = result.documentSentiment;
        const data = {documentSentimentScore:sentiment.score, documentSentimentMagnitude:sentiment.magnitude};
        const sentences = result.sentences;
        for (let i=0; i<sentences.length; i++){
            data["sentence"+i]={sentenceText:sentences[i].text.content,
                sentenceSentiment:sentences[i].sentiment.score,
                sentenceMagnitude:sentences[i].sentiment.magnitude
            };
        }
        return data;
    } catch (err) {
        console.log("Error in analyzeSentimentOfText function: ", err.message);
    }
};
