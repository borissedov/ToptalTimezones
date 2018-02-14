import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import { PrivateRoute } from './components/PrivateRoute'

import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';


export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <PrivateRoute path='/counter' component={Counter} />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
    <Route path="/login" component={LoginPage} />
    <Route path="/register" component={RegisterPage} />
</Layout>;
