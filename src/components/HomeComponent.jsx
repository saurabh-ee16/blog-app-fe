import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthenticationService from "../service/AuthenticationService";


class HomeComponent extends Component {
    render() {
        let name = this.props.params.name;
        let role = AuthenticationService.getUserRole();    
        return (
            <div>
                <h3>Welcome to home page, {name}</h3>
                <p>You can manage your blogs here, <Link to={"/blogs"}>blogs</Link></p>
            </div>
        );
    }


}

export default HomeComponent;