// action type
const SET_USER = 'SET_USER'
const SET_FITNESS = 'SET_FITNESS'
const GET_USER = 'GET_USER'
const GET_FITNESS = 'GET_FITNESS'

// action creators
function setUser(text) {
	return { type: SET_USER,  text};
}

function setUser2() {
  return (dispatch) => {
	return fetch("api/set.json").then(
		res => res.json().then(data => dispatch(setUser(data.useridx)))
	);
  };
}
function setFitness(text) {
	return { type: SET_FITNESS,  text};
}

function setFitness2() {
  return (dispatch) => {
	return fetch("api/set.json").then(
		res => res.json().then(data => dispatch(setFitness(data.fitnessidx)))
	);
  };
}

/*
function complete({complete, id}) {
	console.log(complete+" "+ id);
	return { type: COMPLETE_TODO,  complete, id};
}

function getfitness(data2) {
  return (dispatch) => {
	return fetch("api/add.json").then(
		res => res.json().then(data => dispatch(complete(data2)))
	);
  };
}*/

export  {
	SET_USER,
	SET_FITNESS,
	setUser,
	setUser2,
    setFitness,
    setFitness2
}
