import userinfo from './userinfo';
import authentication from './authentication';
import { combineReducers } from 'redux';

export default combineReducers({
  userinfo,
  authentication,
});
