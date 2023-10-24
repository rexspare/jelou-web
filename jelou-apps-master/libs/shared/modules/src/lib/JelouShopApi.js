import axios from "axios";

const { JELOU_SHOP_API } = require("config");

export const JelouShopApi = axios.create({
    baseURL: JELOU_SHOP_API,
});

JelouShopApi.interceptors.request.use((config) => {
    return {
        ...config,
        headers: {
            "Accept-Language": "es",
            "Content-Type": "application/json",
        },
    };
});
