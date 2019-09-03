export function reducer(state = {}, action) {
    if (action.type == "UPDATE_TEXT") {
        return {
            ...state,
            inputText: action.text
        };
    }
    if (action.type == "UPDATE_EVALUATION") {
        return {
            ...state,
            evaluation: {
                ...action.data,
                entitiesAnalysis: action.data.entitiesAnalysis.filter(
                    entity => entity.entitySalience > 0.2
                )
            }
        };
    }
    if (action.type == "UPDATE_VALUE_OF_EVALUATION") {
        return {
            ...state,
            valueOfEvaluation: action.val
        };
    }
    if (action.type == "DELETE_EVALUATION") {
        return {
            ...state,
            evaluation: null
        };
    }
    if (action.type == "CURRENT_VALUE_OF_TEXTAREA") {
        return {
            ...state,
            currValOfTextArea: action.val
        };
    }
    if (action.type == "UPDATE_HIGHLIGHTED_TEXT") {
        return {
            ...state,
            highlightedText: action.text
        };
    }
    if (action.type == "UPDATE_REPHRASING") {
        return {
            ...state,
            rephrasing: action.sentences,
            rephrasingId: action.id
        };
    }

    if (action.type == "LOGIN_ID") {
        return {
            ...state,
            logInId: action.id
        };
    }

    if (action.type == "UPDATE_LOGIN_ID") {
        return {
            ...state,
            logInId: action.id
        };
    }
    if (action.type == "UPDATE_USERNAME") {
        return {
            ...state,
            userName: action.username
        };
    }
    if (action.type == "UPDATE_HISTORY") {
        return {
            ...state,
            history: action.history
        };
    }
    return {};
}
