import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000';

export const resetPassword = (userData) => {
    axios
        .post("api/users/reset_password")
        .then(response => console.log(response.data))
        .catch(err => console.log(err))
}

export const resetUsername = (userData) => {
    axios
        .post("api/users/reset_username")
        .then(response => console.log(response.data))
        .catch(err => console.log(err))
}