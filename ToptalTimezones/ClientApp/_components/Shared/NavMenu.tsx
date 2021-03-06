import * as React from 'react';
import {NavLink, Link} from 'react-router-dom';
import {User} from "../../domain";

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        const user = JSON.parse(localStorage.getItem('user') as string) as User;
        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse'
                            data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}>ToptalTimezones</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink exact to={'/'} activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        {user && <li>
                            <NavLink to={'/my_clocks'} activeClassName='active'>
                                <span className='glyphicon glyphicon-time'></span> My Clocks
                            </NavLink>
                        </li>
                        }
                        {user && (user.role == 2 || user.role == 3) && <li>
                            <NavLink to={'/user_list'} activeClassName='active'>
                                <span className='glyphicon glyphicon-user'></span> Users
                            </NavLink>
                        </li>
                        }
                        {user && <li>
                            <NavLink to={'/logout'} activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Logout
                            </NavLink>
                        </li>
                        }
                        {!user && <li>
                            <NavLink to={'/login'} activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Login
                            </NavLink>
                        </li>
                        }
                        {!user && <li>
                            <NavLink to={'/register'} activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Register
                            </NavLink>
                        </li>
                        }
                        {/*{this.renderLogout()}*/}
                        {/*{this.renderLogin()}*/}
                        {/*{this.renderRegister()}*/}
                    </ul>
                </div>
            </div>
        </div>;
    }

    private renderLogout() {
        if (localStorage.getItem('user')) {
            return <li>
                <NavLink to={'/logout'} activeClassName='active'>
                    <span className='glyphicon glyphicon-th-list'></span> Logout
                </NavLink>
            </li>;
        }
    }

    private renderLogin() {
        if (!localStorage.getItem('user')) {
            return <li>
                <NavLink to={'/login'} activeClassName='active'>
                    <span className='glyphicon glyphicon-th-list'></span> Login
                </NavLink>
            </li>;
        }
    }

    private renderRegister() {
        if (!localStorage.getItem('user')) {
            return <li>
                <NavLink to={'/register'} activeClassName='active'>
                    <span className='glyphicon glyphicon-th-list'></span> Register
                </NavLink>
            </li>;

        }
    }
}