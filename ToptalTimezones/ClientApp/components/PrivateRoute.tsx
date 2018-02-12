import * as React from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom';

type RouteComponent = React.StatelessComponent<RouteComponentProps<{}>> | React.ComponentClass<any>

const AUTHENTICATED = (localStorage.getItem('user') != null);

export const PrivateRoute: React.StatelessComponent<RouteProps> = ({ component, ...rest }) => {
    const renderFn = (Component?: RouteComponent) => (props: RouteProps) => {
        if (!Component) {
            return null
        }

        if (AUTHENTICATED) {
            return <Component {...props} />
        }

        const redirectProps = {
            to: {
                pathname: '/login',
                state: { from: props.location },
            },
        }

        return <Redirect {...redirectProps} />
    }

    return <Route {...rest} render={renderFn(component)} />
}                           