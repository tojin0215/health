import React from 'react';
import configureStore from './store/index';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import reducer from './reducer/index';
import App from './component/App'
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const store = configureStore(reducer,{
	"userinfo" : {"member_no":1, "member_name":"박재진", "fitness_no":1, "fitness_name":"투진헬스장"}
});

const render = () => {
  ReactDOM.render(
	<BrowserRouter>
  	<Provider store={store}>
	    <App/>
    </Provider>
	</BrowserRouter>,
    document.getElementById('root')
  )
};

store.subscribe(render); //subscribe 메서드로 등록한 리스너 호출(render메서드 호출해 view 갱신)
render();