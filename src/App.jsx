import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Countdown from './pages/Countdown';
import Error404 from './pages/Error404';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact render={() => <Home />}/>
        <Route path="/countdown" exact render={() => <Countdown />}/>
        <Route path="/docs" exact render={() => <Error404 />}/>
        <Route component={Error404} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
