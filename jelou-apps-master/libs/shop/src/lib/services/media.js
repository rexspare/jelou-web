import axios from "axios";
import { JelouShopApi } from "@apps/shared/modules";

export const getMediaProducts = async ({ productId = null, app_id = null } = {}) => {
    if (!app_id || !productId) {
        console.error("error al intentar recuperar las imagenes de este producto", { productId, app_id });
        return Promise.reject("El id del producto o las credenciales no son válidas, por favor refresque la página e intente nuevamente");
    }

    try {
        const { data, status } = await JelouShopApi.get(`/apps/${app_id}/products/${productId}`, {
            params: {
                include: "media",
            },
        });

        if (status === 200) {
            const { media = [] } = data?.data || {};
            return media;
        }

        Promise.reject("Tuvimos un error al recuperar las imágenes de este producto, por favor refresque la página e intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};

export const deleteImageProduct = async ({ productId = null, imageId = null, app_id = null } = {}) => {
    if (!app_id || !productId || !imageId) {
        console.error("error al intentar eliminar la imagen de este producto", { productId, app_id, imageId });
        return Promise.reject("El id del producto o las credenciales no son válidas, por favor refresque la página e intente nuevamente");
    }

    try {
        const { status } = await JelouShopApi.delete(`/apps/${app_id}/products/${productId}/images/${imageId}`);

        if (status === 204) return true;

        Promise.reject("Tuvimos un error al eliminar la imagen de este producto, por favor refresque la página e intente nuevamente");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
};
