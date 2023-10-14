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
    // Apply for every request
    axios.defaults.headers.common["Authorization"] = "Token " + token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const userToken = localStorage.getItem("token");

export const emailIsValid = email => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))

export const defaultTime = 8000;