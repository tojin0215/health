import React from 'react';
import configureStore from './store/index';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import reducer from './reducer/index';
import App from './component/App';
import './styles/index.css';
import './styles/basic.css';
import './styles/layout.css';
import './styles/table.css';
import './styles/specific.css';
import { BrowserRouter } from 'react-router-dom';

const store = configureStore(reducer,{});

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