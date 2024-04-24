import {api} from "@/app/api/configs";

export const deleteGame = async (id) => {
    api.defaults.headers.common["Authorization"] = "Token " + localStorage.getItem("token");
    try {
        const response = await api.delete(`/games/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}