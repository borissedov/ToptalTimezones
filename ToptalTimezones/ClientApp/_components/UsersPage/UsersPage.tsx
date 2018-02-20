import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import * as Users from "../../_reducers/User";
import {User} from "../../domain";
import {connect} from "react-redux";
import {ApplicationState} from "../../_reducers";
import UserEdit from "./UserEdit"


// At runtime, Redux will merge together...
type UsersProps =
    Users.UsersState        // ... state we've requested from the Redux store
    & typeof Users.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>; // ... plus incoming routing parameters

type UsersState = { editingUser: User, isNew: boolean }

class UsersPage extends React.Component<UsersProps, UsersState> {
    constructor(props: any) {
        super(props);

        this.state = {editingUser: this.props.editingUser, isNew: false};

        this.onAddClick = this.onAddClick.bind(this);
        this.onSaveUser = this.onSaveUser.bind(this);
    }

    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestUser();
    }

    componentWillReceiveProps(nextProps: UsersProps) {
        // This method runs when incoming props (e.g., route params) change
        this.setState({editingUser: this.props.editingUser})
    }

    onDeleteClick(user: User) {
        this.props.deleteUser(user);
    }

    onEditClick(user: User) {
        this.setState({
            editingUser: user,
            isNew: false
        })
    }

    onAddClick() {
        this.setState({
            editingUser: {},
            isNew: true
        })
    }

    onSaveUser(user: User) {
        this.props.saveUser(user);
        this.setState({
            isNew: false
        })
    }

    roleNameById(roleId?: number) {
        switch (roleId) {
            case 1:
                return "Registered";
            case 2:
                return "User Manager";
            case 3:
                return "Admin";
            default :
                return "";
        }
    }

    public render() {
        const {userSaving} = this.props;
        const {editingUser, isNew} = this.state;
        return <div>
            <h1>Users</h1>
            {this.renderUsersTable()}
            <div className="row">
                <div className="col-md-12">
                    <button className="btn btn-success" onClick={this.onAddClick}>Add</button>
                </div>
            </div>
            <UserEdit user={editingUser} userSaving={userSaving} isNew={isNew} onSave={this.onSaveUser}/>
        </div>;
    }

    private renderUsersTable() {
        return <table className='table'>
            <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {this.props.users.map(user => {
                return <tr key={user.id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.username}</td>
                    <td>{this.roleNameById(user.role)}</td>
                    <td>
                        <button className="btn btn-sm btn-info" onClick={() => this.onEditClick(user)}>
                            <i className="glyphicon glyphicon-edit"/>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => this.onDeleteClick(user)}>
                            <i className="glyphicon glyphicon-trash"/>
                        </button>
                    </td>
                </tr>

            })}
            </tbody>
        </table>;
    }
}

export default connect(
    (state: ApplicationState) => state.users, // Selects which state properties are merged into the component's props
    Users.actionCreators                 // Selects which action creators are merged into the component's props
)(UsersPage) as typeof UsersPage;
