import axios from "axios";
import {setAxiosAuthToken, unsetCurrentUser} from "@/app/api/utils";
import {api} from "@/app/api/configs";

export const signin = async (username, password) => {
    try {
        const response = await api.post("/auth/token/login/", {
            username,
            password,
        });
        const {auth_token} = response.data;
        console.log("setting token");
        setAxiosAuthToken(auth_token);
        await getUser();
        localStorage.setItem("token", auth_token);
        return auth_token;
    } catch (error) {
        return error.response.data;
    }
}

const getUser = async () => {
    try {
        const response = await api.get("/auth/users/me/");
        const user = {
            username: response.data.username,
            email: response.data.email
        };
        localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
    }
}