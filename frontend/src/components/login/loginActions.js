import axios from "axios";
import { push } from "connected-react-router";
import { useNavigate } from "react-router-dom";
import { SET_TOKEN, SET_CURRENT_USER, UNSET_CURRENT_USER } from "./loginTypes";
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
      //dispatch(unsetCurrentUser());
      //dispatch(push("/"));
    })
    .catch(error => {
      //dispatch(unsetCurrentUser());
    });
};