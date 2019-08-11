export function reducer (state={}, action){
    if (action.type=="UPDATE_TEXT"){
        return {
            ...state, inputText:action.text
        };
    }
    return {};
}
