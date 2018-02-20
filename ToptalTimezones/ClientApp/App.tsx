import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { History } from 'history';
import LoginPage from "./_components/LoginPage/LoginPage";
import RegisterPage from "./_components/RegisterPage/RegisterPage";
import LogoutPage from "./_components/LogoutPage/LogoutPage";
import Layout from "./_components/Shared/Layout"; 
import {PrivateRoute} from "./_components/Shared";
import {ApplicationState} from "./_reducers";
import ClocksPage from "./_components/ClocksPage/ClocksPage";
import HomePage from "./_components/HomePage/HomePage";
import UsersPage from "./_components/UsersPage/UsersPage";

interface Props {
    store: Store<ApplicationState>;
    browserHistory: History;
}

export class App extends React.Component<Props, {}> {
    constructor(props: Props){
        super(props);
        
    }
    
    render() {
        const { store, browserHistory } = this.props;

        let routes = (
            <Layout store={store}>
                <Route exact path='/' component={HomePage} />
                <PrivateRoute path='/my_clocks' component={ClocksPage} />
                <PrivateRoute roles={[2, 3]} path='/user_list' component={UsersPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/logout" component={LogoutPage} />
            </Layout>
        );

        return (
            <Provider store={store}>
                <ConnectedRouter history={browserHistory} children={routes}/>
            </Provider>
        );
    }
}