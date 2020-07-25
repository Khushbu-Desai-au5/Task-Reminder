import React from 'react';
import './App.css';
import CalendarApp from './components/Calender'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css'

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login'
import Forget from './components/Forget';
import Reset from './components/Reset'
function App() {
  return (

    <div className="App">
      <BrowserRouter>
        <Switch>
        <Route exact path='/' component={Login}/>
          <Route exact path='/signup' component={Signup}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path="/task" component={CalendarApp} />
          <Route exact path="/forget" component={Forget} />
          <Route exact path="/reset/:token" component={Reset} />

        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
