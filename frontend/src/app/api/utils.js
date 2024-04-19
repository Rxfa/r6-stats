import axios from "axios";
import {api} from "@/app/api/configs";

export const setAxiosAuthToken = token => {
    if (typeof token !== "undefined" && token) {
        api.defaults.headers.common["Authorization"] = "Token " + token;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export const unsetCurrentUser = () => {
    setAxiosAuthToken(undefined);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const isAuthenticated = () => {
    if(typeof window === 'undefined')
        return false;
    const token = localStorage.getItem('token');
    return !!token;
};
