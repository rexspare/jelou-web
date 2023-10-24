import { JelouShopApi } from "@apps/shared/modules";
import axios from "axios";

/**
 * Attach the news tags to the app
 * @param {string} appId - The id of the app
 * @param {string[]} price_group_tags - The name tags list
 */
export const attachPriceToApp = async (appId, price_group_tags) => {
    try {
        const { status } = await JelouShopApi.post(`/apps/${appId}/tags/attach`, { tags: price_group_tags });
        if (status === 200) return true;

        return Promise.reject("Error al obtener los precios, por favor refresque la página e intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};

/**
 * Get all tags for the app
 * @param {string} appId - The id of the app
 * @returns {Promise<string[]>}
 */
export const getAllTagsForApp = async (appId) => {
    try {
        const { data, status } = await JelouShopApi.get(`/apps/${appId}/tags`);
        if (status === 200) return data;

        return Promise.reject("Error al obtener los precios, por favor refresque la página e intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};
