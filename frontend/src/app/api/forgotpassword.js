import {api} from "@/app/api/configs";

export const forgotPassword = async (email) => {
    try {
        const response = await api.post("/auth/users/reset_password/", {
            email,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}