import { JelouShopApi } from "@apps/shared/modules";
import axios from "axios";

export const createCategories = async ({ dataForm = null, app_id = null } = {}) => {
    if (!dataForm || !app_id) {
        console.error("service ~ createCategires", { dataForm, app_id });
        return Promise.reject(
            "Error al crear la categoría, no se obtivieron las credenciales necesarias. Por favor refresque la página e intente de nuevo"
        );
    }

    try {
        const { status, data } = await JelouShopApi.post(`/apps/${app_id}/categories`, dataForm);
        if (status === 201) return data.data;

        return Promise.reject("Error al crear la categoría");
    } catch (error) {
        console.error("service ~ createCategories ~ catch", { error });
        if (axios.isAxiosError(error)) {
            return Promise.reject(String(error.response.data));
        }
        const errorMessage = String(error?.message ?? error);
        return Promise.reject(errorMessage);
    }
};

export const deleteCategory = async ({ app_id = null, category_id = null } = {}) => {
    if (!app_id || !category_id) {
        console.error("service ~ deleteCategory", { app_id, category_id });
        return Promise.reject(
            "Error al eliminar la categoría, no se obtivieron las credenciales necesarias. Por favor refresque la página e intente de nuevo"
        );
    }

    try {
        const { status } = await JelouShopApi.delete(`/apps/${app_id}/categories/${category_id}`);

        if (status === 200) return Promise.resolve("Categoría eliminada correctamente");
        return Promise.reject("Error al eliminar la categoría, por favor refresque la página e intente de nuevo");
    } catch (error) {
        console.error("service ~ deleteCategory ~ catch", { error });
        if (axios.isAxiosError(error)) {
            return Promise.reject(String(error.response.data));
        }
        const errorMessage = String(error?.message ?? error);
        return Promise.reject(errorMessage);
    }
};
