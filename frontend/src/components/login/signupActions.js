import axios from "axios";
import {
  CREATE_USER_ERROR,
  CREATE_USER_SUBMITTED,
  CREATE_USER_SUCCESS
} from "./signupTypes";
import { useToast } from "@chakra-ui/react";
import { toast } from 'react-toastify';
import { toastOnError } from "../../utils/utils";

axios.defaults.baseURL = 'http://localhost:8000';
const defaultTime = 8000;

export const SignupNewUser = (userData) => {
  axios
    .post("/api/users/", userData)
    .then(res => {
      return [
        toast.success('🦄 Wow so easy!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          }),
        console.log(res.data)
      ];
    })
    .catch(error => toastOnError(error))
};