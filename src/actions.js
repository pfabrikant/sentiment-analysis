export function updateText(text) {
    return {
        type: "UPDATE_TEXT",
        text: text
    };
}
export function updateEvaluation(data) {
    return {
        type: "UPDATE_EVALUATION",
        data: data
    };
}
export function updateValueOfEvaluation(val) {
    return {
        type: "UPDATE_VALUE_OF_EVALUATION",
        val: val
    };
}
export function deleteEvaluation() {
    return {
        type: "DELETE_EVALUATION"
    };
}
export function currentValueOfTextArea(val) {
    return {
        type: "CURRENT_VALUE_OF_TEXTAREA",
        val: val
    };
}
export function updateHighlightedText(string) {
    return {
        type: "UPDATE_HIGHLIGHTED_TEXT",
        text: string
    };
}
export function updateRephrasing(id, arr) {
    return {
        type: "UPDATE_REPHRASING",
        sentences: arr,
        id: id
    };
}

export function logInId(int) {
    return {
        type: "LOGIN_ID",
        id: int
    };
}

export function updateLogInId(int) {
    return {
        type: "UPDATE_LOGIN_ID",
        id: int
    };
}
export function updateUsername(str) {
    return {
        type: "UPDATE_USERNAME",
        username: str
    };
}
export function updateHistory(arr) {
    return {
        type: "UPDATE_HISTORY",
        history: arr
    };
}
