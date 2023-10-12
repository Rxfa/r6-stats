import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAxiosAuthToken } from "../../utils/utils";

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

export const logout = () => {
  axios
    .post("/api/token/logout/")
    .then(response => {
    })
    .catch(error => {
    });
};