import * as React from 'react';
import {Redirect, Route, RouteComponentProps, RouteProps} from 'react-router-dom';
import {User} from "../../domain";

type RouteComponent = React.StatelessComponent<RouteComponentProps<{}>> | React.ComponentClass<any>
type PrivateRouteProps = RouteProps & { roles?: number[] }

export const PrivateRoute: React.StatelessComponent<PrivateRouteProps> = ({component, roles, ...rest}) => {
    const renderFn = (Component?: RouteComponent) => (props: RouteProps) => {
        if (!Component) {
            return null
        }

        const user = JSON.parse(localStorage.getItem('user') as string) as User;
        const roles1 = roles ? roles : [];
        if (user != null && user.role && (roles1.length == 0 || roles1.indexOf(user.role) != -1) ) {
            return <Component {...props} />
        }

        const redirectProps = {
            to: {
                pathname: '/login',
                state: {from: props.location}
            }
        };

        return <Redirect {...redirectProps} />
    };

    return <Route {...rest} render={renderFn(component)}/>
};                