import axios from "axios";

const usersBasePath = "api/users/";
const tokenBasePath = "api/token/";

export const signInUser = (userData) =>
    axios.post( tokenBasePath + "login/", userData)

export const createUser = (userData) => axios.post(usersBasePath, userData)

export const getUserInfo = () => axios.get(usersBasePath + "me/")

export const setPassword = userData => {
    axios
        .post(usersBasePath + "set_password", userData)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
}
export const setUsername = userData => {
    axios
        .post(usersBasePath + "set_username", userData)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
}
export const resetPassword = (userData) => {
    axios
        .post(usersBasePath + "reset_password", userData)
        .then(response => console.log(response.data))
        .catch(err => console.log(err))
}
export const resetPasswordConfirm = (userData) => {

}
export const resetUsername = (userData) => {
    axios
        .post( usersBasePath + "reset_username", userData)
        .then(response => console.log(response.data))
        .catch(err => console.log(err))
}