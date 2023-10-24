import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { JelouShopApi } from "@apps/shared/modules";
import get from "lodash/get";

export default function useProduct() {
    const [limitPage, setLimitPage] = useState(null);
    const [loadintProducts, setLoadingProduct] = useState(false);
    const [page, setPage] = useState(1);
    const [productList, setProductList] = useState([]);
    const [serachParams, setSerachParams] = useState({});

    const company = useSelector((state) => state.company);

    useEffect(() => {
        company.properties?.shopCredentials && searchProduct();
    }, [serachParams, company.properties?.shopCredentials]);

    useEffect(() => {
        if (limitPage && page !== 1 && page <= limitPage) handlePageChange();
    }, [page]);

    const searchProduct = async () => {
        const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", "");
        if (!app_id) return;
        setLoadingProduct(true);
        try {
            const { data } = await JelouShopApi.post(
                `apps/${app_id}/products/search`,
                {
                    ...serachParams,
                    sort: [
                        {
                            field: "created_at",
                            direction: "desc",
                        },
                    ],
                },
                {
                    params: {
                        include: "media",
                        page: 1,
                    },
                }
            );
            setPage(data?.meta.current_page);
            setLimitPage(data?.meta.last_page);
            setProductList(data?.data ?? []);
            setLoadingProduct(false);
        } catch (error) {
            setLoadingProduct(false);
            console.log(error);
        }
    };

    const handlePageChange = async () => {
        const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", "");
        if (!app_id) return;
        try {
            const { data } = await JelouShopApi.post(
                `apps/${app_id}/products/search`,
                {
                    ...serachParams,
                    sort: [
                        {
                            field: "created_at",
                            direction: "desc",
                        },
                    ],
                },
                {
                    params: {
                        include: "media,details",
                        page,
                    },
                }
            );
            setPage(data?.meta.current_page);
            setLimitPage(data?.meta.last_page);
            setProductList((preStateProductList) => [...preStateProductList, ...(data?.data ?? [])]);
        } catch (error) {
            console.log(error);
        }
    };

    return { productList, loadintProducts, limitPage, page, setSerachParams, setPage };
}
