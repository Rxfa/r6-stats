import {api} from "./axiosConfig";

const roundsPath = '/rounds/';

export const getRounds = () => api.get(roundsPath);