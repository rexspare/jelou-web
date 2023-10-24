import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { actionShowModal, modalsActions } from "../../actions/modalsStates";
import { ProductsModals } from "../../components/Actions/ProductsModals";
import { ActionsTitle } from "../../components/ActionsTitle";
import { useInitFilters } from "../../components/filter/initFilters";
import { WrapFilterList } from "../../components/filter/wrapFilterList";
import { Pagination } from "../../components/Pagination";
import { Table } from "../../components/Table";
import { INITIALS_STATES_MODALS, STRUCTURE_ACTIONS } from "../../hooks/constants.structureCols";
import { useEstructureColumns } from "../../hooks/estructureColumns";
import { useProducts } from "../../hooks/Products";

export function ProductTable({ app_id } = {}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [productData, setProductData] = useState({});

    const { arrayFilterProducts } = useInitFilters();

    const [modalStates, dispatch] = useReducer(modalsActions, INITIALS_STATES_MODALS);

    const handelSetData = (data, action) => {
        setProductData(data);
        dispatch(actionShowModal(action));
    };

    const { productColumns } = useEstructureColumns({ setData: handelSetData, setShow: () => null });
    const { getProducts, limit, page, optionsFilters, setLimit, setPage, setOptionsFilters, downloadDataProduct, loadingdownload } = useProducts();

    const {
        data = {},
        isLoading,
        isError,
        error,
    } = useQuery(["products", limit, page, optionsFilters], getProducts, {
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: Boolean(app_id),
    });

    useEffect(() => {
        /**
         * si el app_id es `null` esporque todavia puede existir pero no se le a asignado el valor a `app_id` (redux demora en cargar)
         *
         * si el app_id es `undefined` es por que no existe y no tiene credenciales de shop, por esto se redirecciona a la pagina de activacion
         */
        if (app_id === undefined) navigate("/shop/activate");
    }, [app_id]);

    const { products: productList = [], meta = {} } = data;
    const getQueryKeyProducts = () => ["products", limit, page, optionsFilters];

    return (
        <div className="h-[87vh] rounded-xl bg-white">
            <header>
                <ActionsTitle
                    handleOpenClick={() => dispatch(actionShowModal(STRUCTURE_ACTIONS.CREATE_PRODUCT))}
                    isProduct
                    placeholderInputSearch={t("shop.searchProduct")}
                    setSearch={setOptionsFilters}
                    title={t("shop.table.titleProducts")}
                />

                <WrapFilterList loadingdownload={loadingdownload} downloadData={downloadDataProduct} setSelected={setOptionsFilters} arrayFilter={arrayFilterProducts} isProduct />
            </header>

            <ProductsModals getQueryKey={getQueryKeyProducts} dispatch={dispatch} modalStates={modalStates} productData={productData} />

            <Table dataList={productList} EmptyTable={EmptyMessage} errMsg={error} isError={isError} isProduct loadingTable={isLoading} structureColumns={productColumns} />
            <div className="border-t-1 border-[#a6b4d0] border-opacity-25">{productList.length > 0 && <Pagination setPerPage={setLimit} dataForPage={meta} setCurrentPage={setPage} />}</div>
        </div>
    );
}

function EmptyMessage() {
    const { t } = useTranslation();
    return (
        <>
            <h3 className="mt-4 text-center text-xl font-bold text-gray-400 text-opacity-75">{t("shop.createFirtsProduct")}</h3>
            <p className="text-center text-15 leading-normal text-gray-400 text-opacity-65">{t("shop.noProdutLine")}</p>
        </>
    );
}
