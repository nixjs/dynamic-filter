import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/index.scss';
const rootElement = document.getElementById('root');
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    rootElement,
);
