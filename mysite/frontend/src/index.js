import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './saboteur.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Helmet} from 'react-helmet'

const baseTitle = '矮人礦坑';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Helmet>
                <title>{baseTitle}</title>
            </Helmet>
            <App/>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
