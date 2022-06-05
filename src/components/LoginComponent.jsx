import React, { Component } from "react";
import AuthenticationService from "../service/AuthenticationService";

class LoginComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            role: 'USER',
            email: '',
            isLoggedin: false,
            showErrorMsg: false,
            signUpMessage: null
        }

        this.signInClicked = this.signInClicked.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.signUp = this.signUp.bind(this)

    }

    render() {
        return (
            <div className="container">
                <form className="form-signin">
                    <h2>SignIn</h2>
                    <label htmlFor="username" className="sr-only">Username</label>
                    <input type="text" className="form-control" id="username" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange} required></input>

                    <label htmlFor="email" className="sr-only">Email</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="user@gmail.com" value={this.state.email} onChange={this.handleChange} required></input>

                    <label htmlFor="password" className="sr-only">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required></input>

                    <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="inputGroupSelect01">Role</label>
                        </div>
                        <select className="custom-select" id="inputGroupSelect01" name="role" value={this.state.role} onChange={this.handleChange} required>
                            {/* <option selected>Choose your role</option> */}
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="SUPERADMIN">SuperAdmin</option>
                        </select>
                    </div>
                    <div>
                        <button type="button" className="btn btn-success" onClick={this.signInClicked}>SignIn</button><br />
                        <hr></hr>
                        <button type="button" class="btn btn-outline-primary signup" onClick={this.signUp}>SignUp</button>
                    </div>

                    <IsValidCredentials isLoggedin={this.state.isLoggedin} showErrorMsg={this.state.showErrorMsg} role={this.state.role} />
                    {this.state.signUpMessage != null && <div className="alert alert-success" role="alert">{this.state.signUpMessage}</div>}
                </form>

            </div>

        );

    }

    handleChange(event) {
        //console.log(this.state);
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    signInClicked() {
        let user = {
            userName: this.state.username,
            email: this.state.email,
            password: this.state.password,
            isActive: true,
            roles: this.state.role

        }
        let navigate = this.props.navigate; 
        AuthenticationService.authenticateUser(user)  // authenticate with email & password
            .then(res => {
                if (res.status === 200) {
                    AuthenticationService.registerSuccessfulLogin(user);
                    AuthenticationService.authenticateUserByRole(user.email, user.roles)
                        .then(res => {
                            //success authentication
                            this.setState({ isLoggedin: true })
                            this.setState({ showErrorMsg: false })
                            console.log(res.data)
                            navigate(`/home/${this.state.username}`)
                        }).catch(() => {
                            this.setState({ isLoggedin: false })
                            this.setState({ showErrorMsg: true })
                            AuthenticationService.logout();
                        })
                }
            })
        //let navigate = this.props.navigate;
        /* if (response === true) {
            this.setState({ isLoggedin: true })
            console.log(this.state)
            navigate('/security')
        }

        else {
            this.setState({ showErrorMsg: true })
            console.log(this.state)
        } */

    }

    signUp() {
        let user = {
            userName: this.state.username,
            email: this.state.email,
            password: this.state.password,
            isActive: true,
            roles: this.state.role

        }
        let navigate = this.props.navigate;

        AuthenticationService.userSignUp(user)
            .then(res => {
                if (res.status === 201) {
                    this.setState({ signUpMessage: `Signup successfull, please login` })
                    navigate("/");
                }
            })
    }

}


function IsValidCredentials(props) {
    if (!props.isLoggedin && props.showErrorMsg)
        return (
            <div className="alert alert-warning"> Invalid Credentials or Role </div>
        );
}


export default LoginComponent


