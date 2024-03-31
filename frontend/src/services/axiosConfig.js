import axios from "axios";
import {userToken} from "./services";

export const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000,
    headers: {"Authorization": `Token ${userToken}`}
})

// TODO:Check the timeout