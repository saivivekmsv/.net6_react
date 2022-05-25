import React from 'react';

import './index.css';
import App from './provider/App';
import reportWebVitals from './reportWebVitals';
import ReactDOM from "react-dom";

ReactDOM.render(
  <React.StrictMode>
        <App />
        <div>Provider</div>
  </React.StrictMode>,
  document.getElementById('provider')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
