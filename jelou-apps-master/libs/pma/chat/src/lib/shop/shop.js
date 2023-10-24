import get from "lodash/get";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { useCategories, useProduct } from "@apps/shared/hooks";
import { JelouShopApi } from "@apps/shared/modules";
import { setShowDisconnectedModal } from "@apps/redux/store";
import { checkIfOperatorIsOnline } from "@apps/shared/utils";
import { CategoriesShop } from "../shop-components/categories";
import { GenerateLinkModal } from "../shop-components/generateLinkModal";
import { ProductList } from "../shop-components/productList";
import { Search } from "../shop-components/search";

export default function Shop({ sendCustomText } = {}) {
    const { t } = useTranslation();
    const [indexCategorySeleted, setIndexCategorySeleted] = React.useState("all");
    const [isOpenGenerateModal, setIsOpenGenerateModal] = React.useState(false);
    const [linkGeneratedData, setLinkGenerated] = React.useState(null);
    const [loadingLinkGenerated, setLoadingLinkGenerated] = React.useState(false);
    const { categoriesList, loadintCategories } = useCategories();
    const { loadintProducts, productList, setSerachParams, setPage } = useProduct();

    const company = useSelector((state) => state.company);
    const currentRoom = useSelector((state) => state.currentRoom);
    const counterProductList = useSelector((state) => state.shoppingCartCounter);
    const statusOperator = useSelector((state) => state.statusOperator);

    const dispatch = useDispatch();

    const handleSearchOnChange = ({ target }) => {
        const { value } = target;
        setSerachParams((preState) => ({ ...preState, search: { value } }));
    };

    const handleSearchCategory = (categoryId, index) => {
        if (typeof categoryId === "string" && categoryId === "all") {
            setIndexCategorySeleted("all");
            setSerachParams((preState) => ({ ...preState, filters: [] }));
            return;
        }
        setSerachParams((preState) => ({ ...preState, filters: [{ field: "categories.id", operator: "in", value: [categoryId] }] }));
        setIndexCategorySeleted(index);
    };

    const handleCloseModal = () => {
        setIsOpenGenerateModal(false);
        setLinkGenerated(null);
    };

    const handleGenerateLinkClick = () => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }

        if (counterProductList.length === 0) return;

        const cartProducts = [];
        counterProductList.forEach((prductSeletec) => {
            if (prductSeletec.qty > 0) cartProducts.push(prductSeletec);
        });

        const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", "");
        const user = get(currentRoom, "user", null);
        const owner = get(currentRoom, "owner", null);
        const userProperties = user || owner;

        if (!app_id) return;

        setLoadingLinkGenerated(true);

        JelouShopApi.post(`apps/${app_id}/generate_link`, {
            cart_products: [...cartProducts],
            client: {
                reference_id: get(userProperties, "referenceId", ""),
                names: get(userProperties, "names", get(currentRoom, "name", "")),
            },
            call_to_action: {
                url: "https://wa.me/593968446962",
                text: "Volver a Whatsapp",
            },
        })
            .then(({ data }) => {
                setLoadingLinkGenerated(false);
                setLinkGenerated(data);
                setIsOpenGenerateModal(true);
            })
            .catch((err) => {
                console.log("err", err);
                setLoadingLinkGenerated(false);
                renderMessage(t("plugins.error2"), MESSAGE_TYPES.ERROR);
            });
    };

    return (
        <main className="relative flex max-w-xs flex-col">
            <h2 className="my-3 ml-3 text-lg font-bold text-primary-200">Productos</h2>

            <Search handleSearchOnChange={handleSearchOnChange} />

            <CategoriesShop categoriesList={categoriesList} handleSearchCategory={handleSearchCategory} indexCategorySeleted={indexCategorySeleted} loadintCategories={loadintCategories} />

            <ProductList setPage={setPage} loadintProducts={loadintProducts} productList={productList} />

            <GenerateLinkModal sendCustomText={sendCustomText} closeModal={handleCloseModal} isOpen={isOpenGenerateModal} linkGeneratedData={linkGeneratedData} />

            <footer className="sticky bottom-0 grid h-28 place-content-center bg-white" style={{ boxShadow: "0px -5px 10px -4px rgb(0 0 0 / 20%)" }}>
                <button
                    disabled={loadingLinkGenerated || loadintProducts || counterProductList.length === 0}
                    onClick={handleGenerateLinkClick}
                    className={`my-4 rounded-11 bg-primary-200 px-6 py-2 font-bold text-white ${
                        (loadingLinkGenerated || loadintProducts || counterProductList.length === 0) && "cursor-not-allowed opacity-70"
                    }`}
                >
                    {loadingLinkGenerated ? (
                        <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        t("pma.Generar enlace")
                    )}
                </button>
            </footer>
        </main>
    );
}
