import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import CountdownPage from './pages/CountdownPage';
import Error404 from './pages/Error404';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact render={() => <Login />}/>
        <Route path="/home" exact render={() => <Home />}/>
        <Route path="/countdown" exact render={() => <CountdownPage />}/>
        <Route path="/docs" exact render={() => <Error404 />}/>
        <Route component={Error404} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
