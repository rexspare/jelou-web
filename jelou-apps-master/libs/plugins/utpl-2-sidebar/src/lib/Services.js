import axios from "axios";

export const JelouApiV1 = axios.create({
    baseURL: "https://api.jelou.ai",
});
