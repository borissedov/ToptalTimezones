import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {User} from "../../domain";

export default class HomePage extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        const user = JSON.parse(localStorage.getItem('user') as string) as User;
        return <div>
            <h1>Hello, {user ? user.firstName + " " + user.lastName : "world"}</h1>
            <p>Welcome to your new single-page application, built with:</p>
            <ul>
                <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
                <li><a href='https://facebook.github.io/react/'>React</a>, <a href='http://redux.js.org'>Redux</a>, and <a href='http://www.typescriptlang.org/'>TypeScript</a> for client-side code</li>
                <li><a href='https://webpack.github.io/'>Webpack</a> for building and bundling client-side resources</li>
                <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
            </ul>
        </div>;
    }
}
