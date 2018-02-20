import * as React from "react";
import {User} from "../../domain";

type UserEditProps = {
    user: User,
    userSaving: boolean,
    isNew: boolean,
    onSave(user: User)
}

type UserEditState = {
    id: number,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    submitted: boolean,
    isNew: boolean
}

export default class UserEdit extends React.Component<UserEditProps, UserEditState> {
    constructor(props: any) {
        super(props);
        this.bindState(props);

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps: UserEditProps) {
        this.bindState(nextProps);
    }

    private bindState(props: any) {
        this.state = {
            id: props.user.id ? props.user.id : 0,
            firstName: props.user.firstName ? props.user.firstName : '',
            lastName: props.user.lastName ? props.user.lastName : '',
            username: props.user.username ? props.user.username : '',
            password: props.user.password ? props.user.password : '',
            submitted: false,
            isNew: props.isNew
        };
    }

    handleOnChange(event: any): void {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event: any): void {
        event.preventDefault();

        this.setState({submitted: true});
        const {id, firstName, lastName, username, password} = this.state;
        this.props.onSave({id, firstName, lastName, username, password});
    }

    render() {
        const {userSaving} = this.props;
        const {id, firstName, lastName, username, password, submitted, isNew} = this.state;
        const visible = isNew || id != 0;
        return (
            <div className={"col-md-6 col-md-offset-3 "  + (visible ? "" : "hidden")}>
                <h2>{isNew ? "Add User" : "Editing User: " + firstName + " " + lastName}</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <input type="hidden" name="id" value={id}/>
                    <div className={'form-group' + (submitted && !firstName ? ' has-error' : '')}>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" name="firstName" value={firstName} onChange={this.handleOnChange} />
                        {submitted && !firstName &&
                        <div className="help-block">First Name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !lastName ? ' has-error' : '')}>
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={lastName} onChange={this.handleOnChange} />
                        {submitted && !lastName &&
                        <div className="help-block">Last Name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleOnChange} />
                        {submitted && !username &&
                        <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleOnChange} />
                        {submitted && !password &&
                        <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Save</button>
                        {userSaving &&
                        <img
                            src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                        }
                    </div>
                </form>
            </div>
        );
    }
}