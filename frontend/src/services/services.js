import axios from "axios";

export const setToken = token => {
    setAxiosAuthToken(token);
    localStorage.setItem("token", token);
};
export const unsetCurrentUser = () => {
    setAxiosAuthToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
export const setAxiosAuthToken = token => {
    if (typeof token !== "undefined" && token) {
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};
export const logout = () => {
    axios
        .post("/api/logout/")
        .then(response => {
        })
        .catch(error => {
        });

    unsetCurrentUser();
};
export const isLogged = () => {
    if (!userToken || userToken === undefined) {
        return false;
    }
    return true;
}
export const getUser = () => JSON.parse(localStorage.getItem("user"))
export const userToken = localStorage.getItem("token");
export const defaultTime = 8000;
