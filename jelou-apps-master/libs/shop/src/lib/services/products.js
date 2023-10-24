import axios from "axios";

import { JelouShopApi } from "@apps/shared/modules";

/**
 * @param {{
 * app_id: string,
 * optionsFilters: object,
 * page: number,
 * limit: number
 * }} params - The params to be used to get the products.
 * @returns {Promise<{meta: object, products: object[]}>}
 */
export const getAllProducts = async ({ app_id = null, optionsFilters = {}, page, limit } = {}) => {
    if (!app_id) {
        console.error("error al intentar recuperar los productos", { app_id, optionsFilters, page, limit });
        return Promise.reject("Error al recuperar las credenciales, por favor refresque la página e intente nuevamente");
    }

    try {
        const { data, status } = await JelouShopApi.post(
            `/apps/${app_id}/products/search`,
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
                params: {
                    include: "categories,media",
                    page,
                    per_page: limit,
                },
            }
        );

        if (status === 200) {
            const { meta = {}, data: products = [] } = data;
            return { products, meta };
        }

        Promise.reject("Huvo un error al recuperar los productos, por favor refresque la página e intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};

/**
 * @param {{
 * formData: FormData,
 * app_id: string
 * }} params - all params for create product
 * @returns {Promise<string | null>} - return id product
 */
export const createProduct = async ({ formData = null, app_id } = {}) => {
    if (!formData || !app_id) {
        console.error("Error create product", { formData, app_id });
        return Promise.reject("Las credenciales o el formulario no son válidos, por favor refresque la página e intente nuevamente");
    }

    try {
        const { data } = await JelouShopApi.post(`/apps/${app_id}/products?include=categories`, formData);
        return data.data?.id || null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response;
            throw errorMessage;
        }
        throw error;
    }
};

/**
 * @param {{
 * productId: string,
 * formData: FormData,
 * app_id: string
 * }} params - all params for update product
 * @returns {Promise<string | null>} - return id product
 */
export const updateProduct = async ({ productId = null, formData = null, app_id = null } = {}) => {
    if (!productId || !formData || !app_id) {
        console.error("Error updating product", { formData, app_id, productId });
        return Promise.reject("Las credenciales o el formulario no son válidos, por favor refresque la página e intente nuevamente");
    }

    try {
        const { data } = await JelouShopApi.post(`/apps/${app_id}/products/${productId}?_method=PATCH`, formData);
        return data?.data?.id || null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response;
            throw errorMessage;
        }
        throw error;
    }
};

/**
 * @param {{
 * productId: string,
 * app_id: string
 * }} params - all params for delete product
 */
export const deleteProduct = async ({ productId = null, app_id } = {}) => {
    if (!productId || !app_id) {
        console.error("Error create product", { app_id, productId });
        return Promise.reject("Las credenciales o el formulario no son válidos, por favor refresque la página e intente nuevamente");
    }

    try {
        await JelouShopApi.delete(`/apps/${app_id}/products/${productId}`);
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Download data product
 * @param {{
 * app_id: string,
 * optionsFilters: object,
 * page: number,
 * limit: number
 * download: boolean
 * }} params - all params for download data product
 * @returns {Promise<Blob>} - return a blob with the data
 */
export async function downloadProduct({ app_id, optionsFilters, page, limit, download = false }) {
    if (!app_id) {
        console.error("Error al intentar descargar el reporte de productos", { app_id });
        return Promise.reject("Las credenciales no son válidas, por favor refresque la página e intente nuevamente");
    }
    try {
        const { data, status } = await JelouShopApi.post(
            `/apps/${app_id}/products/search`,
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
                params: {
                    include: "categories,media",
                    page,
                    per_page: limit,
                    download,
                },
                responseType: "blob",
            }
        );

        if (status === 200) return data;

        Promise.reject("Huvo un error al recuperar los productos, por favor refresque la página e intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
}
