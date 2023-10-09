import axios from "axios";
import {
  CREATE_USER_ERROR,
  CREATE_USER_SUBMITTED,
  CREATE_USER_SUCCESS
} from "./signupTypes";

export const signupNewUser = userData => dispatch => {
  dispatch({ type: CREATE_USER_SUBMITTED }); // set submitted state
  axios
    .post("/api/users/", userData)
    .then(response => {
      dispatch({ type: CREATE_USER_SUCCESS });
    })
    .catch(error => {
      if (error.resposne) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        dispatch({
          type: CREATE_USER_ERROR,
          errorData: error.response.data
        });
      }
    });
};