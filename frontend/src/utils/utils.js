import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000';

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
    // Apply for every request
    axios.defaults.headers.common["Authorization"] = "Token " + token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const logout = () => {
  axios
    .post("/api/token/logout/")
    .then(response => {})
    .catch(error => {});
    
    unsetCurrentUser();
};

export const isLogged = () => {
  if(!userToken || userToken === undefined){
    return false;
  }
  return true;
}

export const getUser = () => JSON.parse(localStorage.getItem("user"))

export const userToken = localStorage.getItem("token");

export const emailIsValid = email => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))

export const defaultTime = 8000;