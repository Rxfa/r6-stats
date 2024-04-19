import {api} from "@/app/api/configs";

export const getGames = async () => {
    api.defaults.headers.common["Authorization"] = "Token " + localStorage.getItem("token");
    try {
        const response = await api.get("/games/");
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log("error", error)
        return error.response.data;
    }
}