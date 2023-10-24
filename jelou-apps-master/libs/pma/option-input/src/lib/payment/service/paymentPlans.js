import axios from "axios";
import { JelouPaymentAPI } from "@apps/shared/modules";

export async function getPaymentsPlans({ app_id, bearer_token }) {
    try {
        const { data, status } = await JelouPaymentAPI.get(`/apps/${app_id}/plans`, {
            headers: {
                Authorization: `Bearer ${bearer_token}`,
            },
        });

        if (status === 200) {
            return data.data;
        }
        return Promise.reject("Error al obtener los planes de pago");
    } catch (error) {
        console.error("Error al optenes los pagos ~ getPaymentsPlans", { error });

        if (axios.isAxiosError(error)) {
            const { response } = error;
            return Promise.reject(response?.data?.message || "Error al obtener los planes de pago");
        }

        return Promise.reject("Error al obtener los planes de pago");
    }
}
