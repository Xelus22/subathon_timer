import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Countdown from './pages/Countdown';

function App() {
  return (
    <BrowserRouter basename="/">
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/countdown" component={Countdown}/>
      </Switch>
    </BrowserRouter>
  )
}

export default App
