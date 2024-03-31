import {api} from "./axiosConfig";

const gamesPath = '/games/';

export const getGames = () => api.get(gamesPath);

export const getGame = (id) => api.get(gamesPath + id);

export const uploadReplay = (data) => api.post("/replays/", data);

