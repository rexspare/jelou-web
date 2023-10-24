import axios from "axios";
import axiosRetry from "axios-retry";

const { JELOU_PAYMENTS_API } = require("config");

export const JelouPaymentAPI = axios.create({
    baseURL: JELOU_PAYMENTS_API,
});

axiosRetry(JelouPaymentAPI, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
