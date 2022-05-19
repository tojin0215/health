import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export default function configureStore(reducer, initialState = {}) {
  const enhancer = compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
  );
  return createStore(reducer, initialState, enhancer); //앱의 상태를 보관하는 Redux 저장소를 만든다
}
