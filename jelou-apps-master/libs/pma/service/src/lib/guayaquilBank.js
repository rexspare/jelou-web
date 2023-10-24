import axios from "axios";

const BG_URL = "https://corsproxy.io/?https://38f7347c-d8c0-4a38-a828-18c257ee4a9c.trayapp.io";
const BG_HEAP_URL = "https://8961050d-5115-41d9-b420-e88e48790855.trayapp.io";
export const BG_API = axios.create({
    baseURL: BG_URL,
    headers: {
        "content-type": "application/json",

        api_key: "YmFuY28gZ3VheWFxdWlsIGplbG91", // add to .env
    },
});

export const BG_HEAP_API = axios.create({
    baseURL: BG_HEAP_URL,
    headers: {
        accept: "application/json",
        "content-type": "application/json",
    },
});
