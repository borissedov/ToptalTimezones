import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Shared/Layout';
import HomePage from './components/HomePage/HomePage';
import FetchData from './components/FetchDataPage/FetchDataPage';
import CounterPage from './components/CounterPage/CounterPage';
import { PrivateRoute } from './components/Shared/PrivateRoute'

import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import { LogoutComponent } from './components/Shared'

export const routes = <Layout>
    <Route exact path='/' component={HomePage} />
    <PrivateRoute path='/counter' component={CounterPage} />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
    <Route path="/login" component={LoginPage} />
    <Route path="/register" component={RegisterPage} />
    <Route path="/logout" component={LogoutComponent} />

</Layout>;
