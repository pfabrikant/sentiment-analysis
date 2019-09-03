// a module that exports methods that communicate with Google's Natural Language API

const language = require("@google-cloud/language");
const client = new language.LanguageServiceClient();

exports.analyzeEntitySentimentOfText = async function(text) {
    const document = {
        content: text,
        type: "PLAIN_TEXT"
    };
    const [result] = await client.analyzeEntitySentiment({ document });
    const entities = result.entities;
    const data = [];
    entities.forEach(entity => {
        data.push({
            entityName: entity.name,
            entitySalience: entity.salience,
            entityType: entity.type,
            entitySentimentScore: entity.sentiment.score,
            entitySentimentMagnitude: entity.sentiment.magnitude
        });
    });
    return data;
};

exports.analyzeSentimentOfText = async function(text) {
    const document = {
        content: text,
        type: "PLAIN_TEXT"
    };
    try {
        const [result] = await client.analyzeSentiment({ document: document });
        const sentiment = result.documentSentiment;
        let data = {
            documentSentimentScore: sentiment.score,
            documentSentimentMagnitude: sentiment.magnitude,
            sentences: []
        };
        const sentences = result.sentences;
        for (let i = 0; i < sentences.length; i++) {
            data.sentences.push({
                sentenceId: i + 1,
                sentenceText: sentences[i].text.content,
                sentenceSentiment: sentences[i].sentiment.score,
                sentenceMagnitude: sentences[i].sentiment.magnitude
            });
        }
        return data;
    } catch (err) {
        console.log("Error in analyzeSentimentOfText function: ", err);
    }
};
