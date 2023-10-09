import axios from "axios";
import { push } from "connected-react-router";
import { SET_TOKEN, SET_CURRENT_USER, UNSET_CURRENT_USER } from "../loginTypes";
import { setAxiosAuthToken } from "../../utils/utils";

axios.defaults.baseURL = 'http://localhost:8000';

export const login = (userData, redirectTo) => {
  console.log("yeah")
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

export const setCurrentUser = (user, redirectTo) => dispatch => {
  localStorage.setItem("user", JSON.stringify(user));
  dispatch({
    type: SET_CURRENT_USER,
    payload: user
  });

  console.log("set user" + redirectTo);
  if (redirectTo !== "") {
    dispatch(push(redirectTo));
  }
};

export const setToken = token => dispatch => {
  setAxiosAuthToken(token);
  localStorage.setItem("token", token);
  dispatch({
    type: SET_TOKEN,
    payload: token
  });
};

export const unsetCurrentUser = () => dispatch => {
  setAxiosAuthToken("");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({
    type: UNSET_CURRENT_USER
  });
};

export const logout = () => dispatch => {
  axios
    .post("/api/token/logout/")
    .then(response => {
      dispatch(unsetCurrentUser());
      dispatch(push("/"));
    })
    .catch(error => {
      dispatch(unsetCurrentUser());
    });
};