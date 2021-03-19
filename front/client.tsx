import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './layouts/App';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://api.42board.com' : 'http://localhost:3095';
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'; // CORS 해결 방법 (보안에 취약하긴 하다.)

render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.querySelector('#app'),
);
