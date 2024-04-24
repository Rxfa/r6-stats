import {api} from "@/app/api/configs";

export const signup = async (userData) => {
    try {
        const response = await api.post("/auth/users/", userData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}