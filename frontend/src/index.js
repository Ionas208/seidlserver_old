import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Login from "./components/Login";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Nav/>
      <Route exact path="/" component={Home}/>
      <Route exact path="/login" component={Login}/>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
