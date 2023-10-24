import { JelouPaymentAPI } from "@apps/shared/modules";
import axios from "axios";

export const cancelOrder = async ({ bearer_token = null, orderId = null } = {}) => {
    if (!bearer_token || !orderId) {
        console.error("bearer_token and orderId is required", { bearer_token, orderId });
        Promise.reject("Hubo un error con las credenciales, por favor refesque la página e intente nuevamente");
    }

    try {
        const { data, status } = await JelouPaymentAPI.post(
            `/orders/${orderId}/cancel`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${bearer_token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (status === 200) return data.payload;

        Promise.reject("Tuvimos un error al cancelar la orden, por favor intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};

/**
 * Get all ordes service
 * @param {string} app_id - Jelou Payments App ID
 * @param {string} bearer_token - Jelou Payments Bearer Token
 * @param {number} page - Page number
 * @param {number} limit - Number of items per page
 * @param {object} optionsFilters - Filters to apply to the search
 * @returns {Promise<{meta: object, orders: object[]}>} all orders
 */
export async function getAllOrders(app_id, bearer_token, page, limit, optionsFilters) {
    if (!app_id || !bearer_token) {
        console.error("error al optener las ordenes - tokens", { app_id, bearer_token });
        Promise.reject("Hubo un error con las credenciales, por favor refesque la página e intente nuevamente");
    }

    try {
        const { data, status } = await JelouPaymentAPI.post(
            `/apps/${app_id}/orders/search`,
            {
                ...optionsFilters,
                sort: [
                    {
                        field: "created_at",
                        direction: "desc",
                    },
                ],
            },
            {
                headers: { authorization: `Bearer ${bearer_token}` },
                params: {
                    include: "client,details",
                    page,
                    limit,
                },
            }
        );

        if (status === 200) {
            const { data: orders, meta } = data;
            return { orders, meta };
        }

        Promise.reject("Tuvimos un error al recuperar las órdenes, por favor intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
}

/**
 * download orders service
 * @param {{
 *  app_id: string,
 * bearer_token: string,
 * page: number,
 * limit: number,
 * optionsFilters: object
 * download: boolean
 * }} params - all params for download orders
 * @returns {Promise<object>}
 */
export async function downloadOrder({ app_id, bearer_token, page, limit, optionsFilters, download = false }) {
    try {
        const { data, status } = await JelouPaymentAPI.post(
            `/apps/${app_id}/orders/search`,
            {
                ...optionsFilters,
                sort: [
                    {
                        field: "created_at",
                        direction: "desc",
                    },
                ],
            },
            {
                headers: { authorization: `Bearer ${bearer_token}` },
                params: {
                    include: "client,details",
                    page,
                    limit,
                    download,
                },
                responseType: "blob",
            }
        );

        if (status === 200) return data;

        Promise.reject("Tuvimos un error al recuperar las órdenes, por favor intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
}
