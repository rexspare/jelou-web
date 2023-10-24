import axios, { AxiosInstance } from "axios";

import { Store } from "@apps/redux/store";
import { get } from "lodash";

const BASE_URL_WORKFLOW = "https://workflows.jelou.ai/v1";

export let WorkflowAPI: AxiosInstance | null = null;

Store.subscribe(() => {
    const company = Store.getState().company;

    const { app_token } = get(company, "properties.builder", { app_token: "" });

    WorkflowAPI = axios.create({
        baseURL: BASE_URL_WORKFLOW,
        headers: {
            "Content-Type": "application/json",
            "X-Api-Key": app_token,
        },
    });
});

const BASE_URL_IA_JELOU_API = "https://ai-functions.jelou.ai/";

export const IA_API = axios.create({
    baseURL: BASE_URL_IA_JELOU_API,
    headers: {
        Authorization: "Basic MDFIMzAzUEMxUTNNM05CSjlKSFcwOVkzUEU6ZDQ5NjE0NTMtNjA1OS00N2M1LTkxODktMDZkOTg4YzI4Njk3",
        "Content-Type": "application/json",
    },
});
