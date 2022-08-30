import userinfoAction from '../action/index';

const { SET_USER, SET_FITNESS } = userinfoAction.userinfo;

const userinfo = (state = [], action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        username: action.text,
      };
    case SET_FITNESS:
      // console.log('setfitness state: ');
      // console.log(state);
      return {
        ...state,
        fitnessidx: 2,
        fitnessname: action.text,
      };
    default:
      return state;
  }
};
export default userinfo;
