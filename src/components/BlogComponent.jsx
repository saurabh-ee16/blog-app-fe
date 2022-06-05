import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { Component } from "react";
import AuthenticationService from "../service/AuthenticationService";
import BlogDataService from "../service/BlogDataService";
import moment from "moment";
const USER = 'USER';
const ADMIN = 'ADMIN';
const SUPERADMIN = 'SUPERADMIN';
const APPROVED = 'APPROVED';
const PENDING = 'PENDING';


class BlogComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.params.id,
            username: '',
            description: '',
            date: moment(new Date()).format('YYYY-MM-DD'),
            postStatus: PENDING
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)

    }

    componentDidMount() {
        if (this.state.id === -1) {
            return
        }

        BlogDataService.retrieveBlogById(this.state.id)
            .then(res => {
                this.setState({
                    description: res.data.description,
                    date: moment(res.data.date).format("YYYY-MM-DD")
                })

            })

    }


    render() {
        let { description, date } = this.state;
        return (
            <div>
                <h1>Blog</h1>
                <div className="container">
                    <Formik
                        initialValues={{ description, date }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="description" component="div"
                                        className="alert alert-warning" />
                                    <ErrorMessage name="date" component="div"
                                        className="alert alert-warning" />
                                    <fieldset className="form-group">
                                        <label>Write your blog</label>
                                        <Field className="form-control" component="textarea" rows="10" name="description" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Date</label>
                                        <Field className="form-control" type="date" name="date" />
                                    </fieldset>
                                    <button className="btn btn-success" type="submit">Save</button>
                                </Form>
                            )
                        }
                    </Formik>

                </div>
            </div>


        )

    }

    onSubmit(values) {
        //let username = AuthenticationService.getLoggedInUserName()

        let role = AuthenticationService.getUserRole()

        if (role === ADMIN)
            this.setState({ postStatus: APPROVED })

        let blog = {
            id: this.state.id,
            subject: '',
            description: values.description,
            date: values.date,
            postStatus: this.state.postStatus
        }

        if (this.state.id === `-1`) {
            //console.log(blog)
            BlogDataService.createBlog(blog)
                .then(() => this.props.navigate('/blogs'))
        } else {
            BlogDataService.updateBlog(blog)
                .then(() => this.props.navigate('/blogs'))
        }

        console.log(values);
    }

    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = 'Enter a Description'
        } else if (values.description.length < 5) {
            errors.description = 'Enter atleast 5 Characters in Description'
        }

        if (!moment(values.date).isValid()) {
            errors.targetDate = 'Enter a valid Target Date'
        }

        return errors

    }


}

export default BlogComponent;