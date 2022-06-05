import axios from "axios";

const API_URL = 'http://localhost:8081'
const AUTH_USER = 'authenticatedUser'
const USER_ROLE = 'role'

class AuthenticationService {

    authenticateUser(user) {
        return axios.get(API_URL + '/user/signin',
            { headers: { authorization: this.createBasicAuthToken(user.email, user.password) } })

    }

    authenticateUserByRole(email, role) {
        let request = { email: email, role: role }
        return axios.post(API_URL + '/user/role-auth', request)
    }

    createBasicAuthToken(email, password) {
        return 'Basic ' + window.btoa(email + ":" + password)
    }

    registerSuccessfulLogin(user) {
        sessionStorage.setItem(AUTH_USER, user.userName)
        sessionStorage.setItem(USER_ROLE, user.roles)
        this.setupAxiosInterceptors(this.createBasicAuthToken(user.email, user.password))
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(AUTH_USER)
        if (user != null)
            return true
        else
            return false
    }

    getUserName() {
        let username = sessionStorage.getItem(AUTH_USER);
        return username;
    }

    getUserRole(){
        return sessionStorage.getItem(USER_ROLE);
    }

    userSignUp(user) {
        return axios.post(API_URL + '/user/signup', user);
    }

    logout() {
        sessionStorage.removeItem(AUTH_USER)
    }

    setupAxiosInterceptors(basicAuthHeader) {

        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = basicAuthHeader;
                }
                return config
            }
        )
    }

}


export default new AuthenticationService();