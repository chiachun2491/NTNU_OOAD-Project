import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';
import './styles/saboteur.scss';
import CustomLayout from './containers/Layout';
import { RootSwitch } from './routes/RootSwitch';
import reportWebVitals from './reportWebVitals';

const baseTitle = '矮人礦坑';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Helmet>
                <title>{baseTitle}</title>
            </Helmet>
            <CustomLayout>
                <RootSwitch />
            </CustomLayout>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
