import { JelouShopApi } from "@apps/shared/modules";
import axios from "axios";

export const getCategoriesOptionsForFilter = async ({ jelou_ecommerce_app_id = null } = {}) => {
    if (!jelou_ecommerce_app_id) {
        console.error("jelou_ecommerce_app_id is required", { jelou_ecommerce_app_id });
        throw new Error("jelou_ecommerce_app_id is required");
    }

    try {
        const { data } = await JelouShopApi.get(`/apps/${jelou_ecommerce_app_id}/categories?paginate=false`);

        const categories = data?.data;
        if (!Array.isArray(categories)) return [];

        return categories.map((category) => {
            const { name, id } = category;
            return {
                value: {
                    filters: [{ field: "categories.id", operator: "in", value: [id] }],
                },
                name,
                id,
                key: "categories",
            };
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw error;
    }
};

export const categoriesData = async ({ jelou_ecommerce_app_id = null, optionSearch = null, limitForPage = null, page = null } = {}) => {
    if (!jelou_ecommerce_app_id || !optionSearch || !limitForPage || !page) {
        console.error("Missing params", { jelou_ecommerce_app_id, optionSearch, limitForPage, page });
        throw new Error("Missing params");
    }

    try {
        const { data } = await JelouShopApi.post(
            `/apps/${jelou_ecommerce_app_id}/categories/search?paginate=true&limit=${limitForPage}&page=${page}`,
            optionSearch
        );
        const { data: categoryList, meta: dataForPage } = data;

        return { categoryList, dataForPage };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw error;
    }
};
