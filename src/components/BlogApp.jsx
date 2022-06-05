import React, { Component } from "react";
import LoginComponent from "./LoginComponent";
import "../bootstrap.css";
import "../App.css";
import "../blogstyle.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import withNavigation from "./WithNavigation";
import HomeComponent from "./HomeComponent";
import SecurityQuestionPage from "./SecurityQuestion";
import HeaderComponent from "./HeaderComponent";
import withParams from './WithParams';
import AuthenticatedRoute from "./AuthenticatedRoute";
import ListBlogComponent from "./ListBlogComponent";
import BlogComponent from "./BlogComponent";

class BlogApp extends Component {

    render() {
        const LoginComponentWithNavigation = withNavigation(LoginComponent)
        const HeaderComponentWithNavigation = withNavigation(HeaderComponent);
        const HomeComponentWithParamsAndNavigation = withParams(withNavigation(HomeComponent))
        const ListBlogComponentWithNavigation = withNavigation(ListBlogComponent);
        const BlogComponentWithParamsAndNavigation = withParams(withNavigation(BlogComponent))
        return (
            <div className="blog-app">

                <Router>
                    <HeaderComponentWithNavigation />
                    <Routes>
                        <Route path="/" element={<LoginComponentWithNavigation />} />
                        <Route path="/login" element={<LoginComponentWithNavigation />} />
                        <Route path="/security" element={<SecurityQuestionPage />} />
                        <Route path="/home/:name" element={<AuthenticatedRoute><HomeComponentWithParamsAndNavigation /></AuthenticatedRoute>} />
                        <Route path="/logout" element={<AuthenticatedRoute><LogoutComponent /></AuthenticatedRoute>} />
                        <Route path="/blogs" element={<AuthenticatedRoute><ListBlogComponentWithNavigation /></AuthenticatedRoute>} />
                        <Route path="/blog/:id" element={<AuthenticatedRoute><BlogComponentWithParamsAndNavigation /></AuthenticatedRoute>} />
                    </Routes>
                </Router>
            </div>
        );
    }



}

class LogoutComponent extends Component {
    render() {

        return (
            <div>
                You have logged out!
            </div>

        )
    }
}


export default BlogApp;