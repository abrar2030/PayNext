import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('user');

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => (
          isAuthenticated ? <Redirect to="/dashboard" /> : <Login />
        )} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        {/* Other routes */}
      </Switch>
    </Router>
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = !!localStorage.getItem('user');
  return (
    <Route {...rest} render={(props) => (
      isAuthenticated ?
        <Component {...props} /> :
        <Redirect to="/login" />
    )} />
  );
}

export default App;
