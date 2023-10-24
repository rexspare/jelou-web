import axios from "axios";
import { JelouPaymentAPI } from "@apps/shared/modules";

export const getSubscriptions = async ({ 
    jelou_ecommerce_app_id = null, 
    bearer_token = null, 
    optionSearch = null, 
    limitForPage = null, 
    page = null 
} = {}) => {

    if (!jelou_ecommerce_app_id) {
        console.error("jelou_ecommerce_app_id is required", { jelou_ecommerce_app_id });
        throw new Error("jelou_ecommerce_app_id is required");
    }

    try {
        const { data } = await JelouPaymentAPI.post(
            `/apps/${jelou_ecommerce_app_id}/plans/search`, 
            optionSearch, 
            {
                headers: {
                    Authorization: `Bearer ${bearer_token}`,
                },
                params: {
                    paginate: true,
                    limit: limitForPage,
                    page: page,
                }
            }
        );

        const { data: subscriptionsList, meta: dataForPage } = data;

        return { subscriptionsList, dataForPage};

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw error;
    }
};

export const createSubscriptions = async ({ dataForm = null, app_id = null, bearer_token = null } = {}) => {
    if (!dataForm || !app_id || !bearer_token) {
        console.error("service ~ createSubscriptions", { dataForm, app_id, bearer_token });
        return Promise.reject(
            "Error al crear la suscripción, no se obtuvieron las credenciales necesarias. Por favor refresque la página e intente de nuevo"
        );
    }

    try {
        const { status, data } = await JelouPaymentAPI.post(`/apps/${app_id}/plans`, dataForm, {
            headers: {
                Authorization: `Bearer ${bearer_token}`,
            },
        });
        if (status === 201) return data.data;

        return Promise.reject("Error al crear la suscripción");
    } catch (error) {
        console.error("service ~ createSubscription ~ catch", { error });
        if (axios.isAxiosError(error)) {
            return Promise.reject(String(error.response.data));
        }
        const errorMessage = String(error?.message ?? error);
        return Promise.reject(errorMessage);
    }
};

export const deleteSubscriptionService = async ({ app_id = null, subscription_id = null, bearer_token = null } = {}) => {
    if (!app_id || !subscription_id || !bearer_token) {
        console.error("service ~ deleteCategory", { app_id, subscription_id });
        return Promise.reject(
            "Error al eliminar la suscripción, no se obtivieron las credenciales necesarias. Por favor refresque la página e intente de nuevo"
        );
    }

    try {
        const { status } = await JelouPaymentAPI.delete(`/apps/${app_id}/plans/${subscription_id}`, {
            headers: {
                Authorization: `Bearer ${bearer_token}`,
            },
        });

        if (status === 200) return status;
        return Promise.reject("Error al eliminar la suscripción, por favor refresque la página e intente de nuevo");
        
    } catch (error) {
        console.error("service ~ deleteSubscription ~ catch", { error });
        if (axios.isAxiosError(error)) {
            return Promise.reject(String(error.response.data));
        }
        const errorMessage = String(error?.message ?? error);
        return Promise.reject(errorMessage);
    }
};