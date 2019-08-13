export function reducer (state={}, action){
    if (action.type=="UPDATE_TEXT"){
        return {
            ...state, inputText:action.text
        };
    }
    if (action.type=="UPDATE_EVALUATION"){
        return {
            ...state, evaluation: {...action.data, entitiesAnalysis:action.data.entitiesAnalysis.filter(entity=>
                entity.entitySalience>0.2
            )
            }
        };
    }
    if (action.type=="UPDATE_VALUE_OF_EVALUATION"){
        return {
            ...state, valueOfEvaluation:action.val
        };
    }
    if (action.type=="CURRENT_VALUE_OF_TEXTAREA"){
        return {
            ...state, currValOfTextArea:action.val
        };
    }
    if (action.type=="UPDATE_HIGHLIGHTED_TEXT"){
        return {
            ...state, highlightedText: action.text
        };
    }
    if (action.type=="UPDATE_REPHRASING"){
        return {
            ...state, rephrasing: action.sentences, rephrasingId:action.id
        };
    }
    return {};
}
