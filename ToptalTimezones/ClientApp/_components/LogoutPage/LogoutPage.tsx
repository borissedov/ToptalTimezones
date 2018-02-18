import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Authentication from '../../_reducers/Authantication';
import { ApplicationState } from "../../_reducers";


// At runtime, Redux will merge together...
type LogoutProps =
    Authentication.AuthanticationState        // ... state we've requested from the Redux store
    & typeof Authentication.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>;


export class LogoutPage extends React.Component<LogoutProps, {}> {
    constructor(props: any) {
        super(props);

        this.props.logout();
    }

    render() {
        const redirectProps = {
            to: {
                pathname: '/'
            }
        };

        return <Redirect {...redirectProps}/>;
    }
}

export default connect(
    (state: ApplicationState) => state.authantication, // Selects which state properties are merged into the component's props
    Authentication.actionCreators                 // Selects which action creators are merged into the component's props
)(LogoutPage) as typeof LogoutPage;