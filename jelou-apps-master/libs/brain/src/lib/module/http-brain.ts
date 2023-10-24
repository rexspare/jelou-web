import { Store } from "@apps/redux/store";
import axios, { AxiosInstance } from "axios";
import { get } from "lodash";

const baseUrl = "https://scenic-truth-trydou4v5prk.vapor-farm-g1.com";

export let HTTP_BRAIN: AxiosInstance | null = null;
export let HTTP_BRAIN_KNOWLEGE: AxiosInstance | null = null;

Store.subscribe(() => {
    const company = Store.getState().company;

    const { app_id, app_token } = get(company, "properties.brain", { app_token: "", app_id: "" });

    HTTP_BRAIN = axios.create({
        baseURL: baseUrl + `/api/v1/apps/${app_id}`,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${app_token}`,
        },
    });

    HTTP_BRAIN_KNOWLEGE = axios.create({
        baseURL: baseUrl + "/api/v1",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${app_token}`,
        },
    });
});
