import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './_components/Shared/Layout';
import HomePage from './_components/HomePage/HomePage';
import FetchData from './_components/FetchDataPage/FetchDataPage';
import CounterPage from './_components/CounterPage/CounterPage';
import { PrivateRoute } from './_components/Shared/PrivateRoute'

import LoginPage from './_components/LoginPage/LoginPage';
import RegisterPage from './_components/RegisterPage/RegisterPage';
import { LogoutComponent } from './_components/Shared'

export const routes = <Layout>
    <Route exact path='/' component={HomePage} />
    <PrivateRoute path='/counter' component={CounterPage} />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
    <Route path="/login" component={LoginPage} />
    <Route path="/register" component={RegisterPage} />
    <Route path="/logout" component={LogoutComponent} />

</Layout>;
