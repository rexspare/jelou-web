import get from "lodash/get";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { JelouShopApi } from "@apps/shared/modules";

export default function useCategories() {
    const [loadintCategories, setLoadingCategories] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);

    const company = useSelector((state) => state.company);

    useEffect(() => {
        company.properties?.shopCredentials && getCategoriesProducts();
    }, [company.properties?.shopCredentials]);

    const getCategoriesProducts = async () => {
        const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", "");
        if (!app_id) return;
        setLoadingCategories(true);
        try {
            const { data } = await JelouShopApi.get(`/apps/${app_id}/categories`, {
                params: {
                    paginate: false,
                },
            });
            setLoadingCategories(false);
            setCategoriesList(data?.data ?? []);
        } catch (error) {
            setLoadingCategories(false);
            console.log(error);
        }
    };

    return { loadintCategories, categoriesList };
}
