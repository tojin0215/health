// action type
const SET_EXERCISE = "SET_EXERCISE"
const SET_EXERCISE_PACK = "SET_EXERCISE_PACK"
const SET_ASSIGN_EXERCISE_PACK = "SET_ASSIGN_EXERCISE_PACK"
const GET_EXERCISE = "GET_EXERCISE"
const GET_EXERCISE_PACK = "GET_EXERCISE_PACK"
const GET_ASSIGN_EXERCISE_PACK = "GET_ASSIGN_EXERCISE_PACK"

// action creators
function setExercise(text) {
    return { type: SET_EXERCISE, text };
}
function setExercise2() {
    return (dispatch) => {
        return fetch("api/set.json")
        .then( response => response.json().then(data => dispatch(setExercise(data.exercise_no))));
    };
}

function setExercisePack(text) {
    return { type: SET_EXERCISE_PACK, text };
}
function setExercisePack2() {
    return (dispatch) => {
        return fetch("api/set.json")
        .then(
            response => response.json().then(data => dispatch(setExercisePack(data.exercise_pack_no)))
        );
    };
}

export {
    SET_EXERCISE,
    SET_EXERCISE_PACK,
    SET_ASSIGN_EXERCISE_PACK,
    setExercise,
    setExercise2,
    setExercisePack,
    setExercisePack2
}