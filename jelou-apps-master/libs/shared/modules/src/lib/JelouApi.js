import axios from "axios";
import axiosRetry from "axios-retry";
// import { addToQueue } from "./../services/QueueErrors";

export const JelouApiPma = axios.create({
    baseURL: process.env.NX_REACT_APP_JELOU_API_BASE,
});

axiosRetry(JelouApiPma, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

JelouApiPma.interceptors.request.use((config) => {
    config.headers = {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
    };

    return config;
});
