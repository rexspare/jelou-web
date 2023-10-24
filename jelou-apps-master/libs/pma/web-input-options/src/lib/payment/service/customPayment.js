import { JelouPaymentAPI } from "@apps/shared/modules";
import axios from "axios";

export async function getPaymentLink({ data, app_id, bearer_token }) {
    try {
        const { data: response } = await JelouPaymentAPI.post(`/apps/${app_id}/generate_link`, data, {
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: `Bearer ${bearer_token}`,
            },
        });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("getPaymentLink - error con axios", { error });
            throw error.message;
        }

        console.error("getPaymentLink", { error });
        throw error?.message ?? String(error);
    }
}
