import axios from "axios";

export const setAxiosAuthToken = token => {
  if (typeof token !== "undefined" && token) {
    // Apply for every request
    axios.defaults.headers.common["Authorization"] = "Token " + token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const isLogged = () => typeof localStorage.getItem("token") === String;

export const emailIsValid = email => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))

export const defaultTime = 8000;