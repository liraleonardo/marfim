import React from 'react';
import { Redirect, Switch, Route as ReactRoute } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import SignUp from '../pages/SignUp';

import Profile from '../pages/Profile';

import Organization from '../pages/Organization';
import User from '../pages/User';
import Role from '../pages/Role';
import Project from '../pages/Project';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/signin" component={SignIn} isPublic />
    <Route path="/signup" component={SignUp} isPublic />

    <Route path="/" exact component={Dashboard} />
    <Route path="/profile" component={Profile} />
    <Route path="/organization" component={Organization} />
    <Route path="/user" component={User} />
    <Route path="/role" component={Role} />
    <Route path="/project" component={Project} />

    <ReactRoute render={() => <Redirect to={{ pathname: '/' }} />} />
  </Switch>
);

export default Routes;
