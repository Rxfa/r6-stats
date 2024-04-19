import {api} from "@/app/api/configs";
import {unsetCurrentUser} from "@/app/api/utils";

export const logout = async () => {
    try {
        await api.post("/auth/token/logout/");
        unsetCurrentUser();
    } catch (error) {

    }
}