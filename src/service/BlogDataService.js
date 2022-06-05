import axios from "axios";

const API_URL = 'http://localhost:8081'
const AUTH_USER = 'authenticatedUser'
const USER_ROLE = 'role'

class BlogDataService {

    retrieveAllBlogs() {
        return axios.get(API_URL + '/blog/get-blogs')
    }

    approveBlog(id) {
        //updating
        return axios.put(API_URL + `/blog/${id}`)
    }

    retrieveBlogById(id) {
        return axios.get(API_URL + `/blog/${id}`)
    }

    createBlog(blog) {
        return axios.post(API_URL+`/blog/create`,blog)
    }

    updateBlog(blog) {
        return axios.put(API_URL+`/blog/update`,blog)
    }
    rejectBlog(id){
        return axios.delete(API_URL+`/blog/${id}`)
    }

}

export default new BlogDataService();