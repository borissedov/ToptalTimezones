import * as React from 'react';
import {RouteComponentProps} from "react-router-dom";
import { browserHistory } from '../../_helpers';

import * as Alert from "../../_reducers/Alert";
import {connect} from "react-redux";
import {ApplicationState} from "../../_reducers";


// At runtime, Redux will merge together...
type AlertProps =
    Alert.AlertState        // ... state we've requested from the Redux store
    & typeof Alert.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>;

class AlertBox extends React.Component<any, {}> {
    constructor(props: any) {
        super(props);
        
        browserHistory.listen((location, action) => {
            // clear alert on location change
            this.props.clear();
        });
    }

    public render() {
        const { message, type } = this.props;

        if (message) {
            return <div className={`alert ${type}`}>{message}</div>;
        }
        else{
            return <div> </div>;
        } 
    }
}

export default connect(
    (state: ApplicationState) => state.alert, // Selects which state properties are merged into the component's props
    Alert.actionCreators                 // Selects which action creators are merged into the component's props
)(AlertBox) as typeof AlertBox;