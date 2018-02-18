import * as React from 'react';
import { NavMenu } from './NavMenu';
import {ApplicationState} from "../../_reducers";
import {Store} from "redux";
import AlertBox from "./AlertBox";
import { History } from 'history';

import {Provider} from "react-redux";

// At runtime, Redux will merge together...
type LayoutProps = {store:  Store<ApplicationState>, children: JSX.Element[]};

// type LayoutProps = Store<ApplicationState> & Element[];

export default class Layout extends React.Component<LayoutProps, {}> {
    constructor(props: LayoutProps) {
        super(props);
    }

    public render() {
        return <div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-3'>
                    <NavMenu />
                </div>
                <div className='col-sm-9'>
                    <Provider store={this.props.store}>
                        <AlertBox />
                    </Provider>
                    { this.props.children }
                </div>
            </div>
        </div>;
    }


}