import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import layout from '../layout';
import Login from '../Login';

import '@/res';

class MRoute extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route component={layout} />
        </Switch>
      </Router>
    );
  }
}

export default MRoute;
