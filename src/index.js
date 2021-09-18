import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './components/HomePage';
import Countdown from './components/Countdown';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/countdown" exact component={Countdown} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
