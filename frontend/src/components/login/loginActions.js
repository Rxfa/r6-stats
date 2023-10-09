import axios from "axios";
import { push } from "connected-react-router";
import { SET_TOKEN, SET_CURRENT_USER, UNSET_CURRENT_USER } from "./loginTypes";
import { setAxiosAuthToken } from "../../utils/utils";

axios.defaults.baseURL = 'http://localhost:8000';

export const login = (userData, redirectTo) => {
  axios
    .post("api/token/login/", userData)
    .then(response => {
      const { auth_token } = response.data;
      setAxiosAuthToken(auth_token);
      setToken(auth_token);
      getCurrentUser(redirectTo);
    })
    .catch(error => {
      unsetCurrentUser();
    });
};

export const getCurrentUser = redirectTo => {
  axios
    .get("/api/users/me/")
    .then(response => {
      const user = {
        username: response.data.username,
        email: response.data.email
      };
      setCurrentUser(user, redirectTo);
    })
    .catch(error => {
      unsetCurrentUser();
    });
};

export const setCurrentUser = (user, redirectTo) => {
  localStorage.setItem("user", JSON.stringify(user));
  console.log("set user" + redirectTo);
};

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