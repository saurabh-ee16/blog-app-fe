import React, { Component } from "react";
import BlogDataService from "../service/BlogDataService";
import moment from "moment";
import AuthenticationService from "../service/AuthenticationService";
const USER = 'USER';
const ADMIN = 'ADMIN';
const SUPERADMIN = 'SUPERADMIN';
const APPROVED = 'APPROVED';
const PENDING = 'PENDING';


class ListBlogComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            blogs: [],
            message: null,
            role: USER
        }

        this.refreshBlog = this.refreshBlog.bind(this)
        this.approveBlog = this.approveBlog.bind(this)
        this.createBlogOnClicked = this.createBlogOnClicked.bind(this)
        this.updateBlogOnClicked = this.updateBlogOnClicked.bind(this)
        this.rejectBlogOnClicked = this.rejectBlogOnClicked.bind(this)
    }

    componentDidMount() {
        this.refreshBlog();
    }

    refreshBlog() {
        let role = AuthenticationService.getUserRole();
        this.setState({ role: role });
        BlogDataService.retrieveAllBlogs()
            .then(res => {
                this.setState({
                    blogs: res.data
                })
            })

    }

    render() {


        return (
            <div className="container">
                <h2>Blog page</h2>
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <table className="table table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th>Description</th>
                            <th>Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.blogs.map(
                                blog =>
                                    <tr key={blog.id} >
                                        {(blog.postStatus === APPROVED || (blog.postStatus === PENDING && this.state.role === SUPERADMIN)) && <td>{blog.subject}{blog.description}</td>}
                                        {(blog.postStatus === APPROVED || (blog.postStatus === PENDING && this.state.role === SUPERADMIN)) && <td>{moment(blog.date).format("MMM Do YY")}</td>}
                                        <td>
                                            <div className="btn-group-vertical">
                                                {(blog.postStatus === PENDING && this.state.role === SUPERADMIN) && <button className="btn btn-sm btn-success" onClick={() => this.approveBlog(blog.id)} >Approve</button>}
                                                {((this.state.role === ADMIN && blog.postStatus === APPROVED) || (this.state.role === SUPERADMIN)) && <button className="btn btn-sm btn-success" onClick={() => this.updateBlogOnClicked(blog.id)} >Update</button>}
                                                {(this.state.role === SUPERADMIN && blog.postStatus === PENDING) && <button className="btn btn-sm btn-warning" onClick={() => this.rejectBlogOnClicked(blog.id)} >Reject</button>}

                                            </div>

                                        </td>

                                    </tr>

                            )

                        }
                    </tbody>

                </table>
                {(this.state.role === ADMIN || this.state.role === SUPERADMIN) && <div>
                    <button className="btn btn-sm btn-success" onClick={this.createBlogOnClicked}>Create blog</button> </div>}

            </div>

        )
    }

    approveBlog(id) {

        BlogDataService.approveBlog(id)
            .then(res => {
                if (res.status === 200) {
                    this.setState({message : `Blog with id ${id}, approved`})
                    this.refreshBlog()
                }
            }).catch(err => { console.error(err); })
    }

    createBlogOnClicked() {
        let navigate = this.props.navigate;
        navigate(`/blog/${-1}`);
    }

    updateBlogOnClicked(id) {
        let navigate = this.props.navigate;
        navigate(`/blog/${id}`);
    }

    rejectBlogOnClicked(id) {
        let role = AuthenticationService.getUserRole();
        BlogDataService.rejectBlog(id)
            .then(res => {
                if (role === SUPERADMIN)
                    this.setState({ message: `Blog with id ${id}, rejected` })
                this.refreshBlog();
            })

    }



}

export default ListBlogComponent;