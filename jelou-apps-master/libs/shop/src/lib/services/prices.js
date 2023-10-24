/** @typedef {import('../components/CreateProduct/Manually/types.createProduct').Price} Price */
import axios from "axios";

import { JelouShopApi } from "@apps/shared/modules";

/**
 * It creates a price for a product
 * @param {string} productId - The product id
 * @param {Price} price - The price for the product
 */
export const createPrice = async (productId, price) => {
    try {
        const { data, status } = await JelouShopApi.post(`products/${productId}/prices`, price);
        if (status === 201) return data.data;

        Promise.reject("Error al crear el precio, por favor intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};

/**
 * It updates a price for a product
 * @param {string} productId - The product id
 * @param {Price} price - The price for the product
 * @param {Price} id - The price id
 */
export const updatePrice = async (productId, price, id) => {
    try {
        const { data, status } = await JelouShopApi.put(`products/${productId}/prices/${id}`, price);
        if (status === 200) return data.data;

        Promise.reject("Error al actualizar el precio, por favor intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};

/**
 * It gets all the prices of a product
 * @param {string} productId - The id of the product you want to get the prices of.
 */
export const getAllPriceOfOneProduct = async (productId) => {
    try {
        const { data, status } = await JelouShopApi.get(`products/${productId}/prices`, {
            params: {
                include: "tags",
            },
        });
        if (status === 200) return data.data;

        Promise.reject("Error al obtener los precios, por favor refresque la página e intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};

/**
 * It deletes a price of a product
 * @param {string} productId - The id of the product that you want to delete the price from.
 * @param {Price} priceId - The id of the price to be deleted
 */
export const deletePriceOfProduct = async (productId, priceId) => {
    try {
        const { status } = await JelouShopApi.delete(`products/${productId}/prices/${priceId}`);
        if (status === 200) return true;

        Promise.reject("Error al eliminar el precio, por favor intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};

/**
 * This service gets the all metadata of the all products
 * @param {{ app_id: string }} param
 * @returns {Promise<object>} - The metadata of the products
 */
export const getMaxMinValuesForRangeFilter = async ({ app_id = null } = {}) => {
    if (!app_id) {
        console.error("error al optener los precios para le filtro", { app_id });
        return Promise.reject(
            "Parece que tuvimos un error con las credenciales para obtener los datos de los precios para el filtro, por favor recarga la página e intenta de nuevo"
        );
    }

    try {
        const { data, status } = await JelouShopApi.get(`/apps/${app_id}/products/_meta`);
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
