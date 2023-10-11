import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000';

export const setPassword = userData => {
    axios
        .post("api/users/set_password", userData)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
}

export const setUsername = userData => {
    axios
    .post("api/users/set_username", userData)
    .then(res => {
        console.log(res.data)
    })
    .catch(err => {
        console.log(err)
    })
}