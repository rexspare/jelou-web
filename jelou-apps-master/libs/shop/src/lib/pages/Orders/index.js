import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionsTitle } from "../../components/ActionsTitle";
import { useInitFilters } from "../../components/filter/initFilters";
import { WrapFilterList } from "../../components/filter/wrapFilterList";
import { Pagination } from "../../components/Pagination";
import { Table } from "../../components/Table";
import { REFECT_INTERVAL_ORDERS } from "../../constants";
import { STRUCTURE_ACTIONS } from "../../hooks/constants.structureCols";
import { useEstructureColumns } from "../../hooks/estructureColumns";
import { useOrders } from "../../hooks/Oreders";

const CancelOrderModal = lazy(() => import("../../components/Actions/CancelOrder"));
const DetailOrder = lazy(() => import("../../components/SeeDetail/order"));

export function Orders() {
    const { t } = useTranslation();
    const [orderRowData, setOrderRowData] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const [showCancelOrder, setShowCancelOrder] = useState(false);

    const { page, setPage, limit, setLimit, downloadDataOrders, getInitialOrders, getOrders, loadingdownload, paramsFilters, setParamsFilters } = useOrders();

    const getQueryKey = () => ["orders", page, limit, paramsFilters];

    const { data, isLoading, isError, error } = useQuery(["orders", page, limit, paramsFilters], getOrders, {
        refetchInterval: REFECT_INTERVAL_ORDERS,
    });
    const { meta = {}, orders: orderList = [] } = data ?? {};

    const handleSetData = (data, action) => {
        setOrderRowData(data);

        if (action === STRUCTURE_ACTIONS.CANCEL_ORDER) setShowCancelOrder(true);
        else setShowDetail(true);
    };

    const { orderColumns } = useEstructureColumns({ setShow: () => null, setData: handleSetData });
    const { arrayFilterOrders } = useInitFilters();

    return (
        <div className="min-h-[17rem] rounded-xl bg-white">
            <header>
                <ActionsTitle setSearch={setParamsFilters} placeholderInputSearch={t("shop.searchOrders")} title={t("shop.table.titleOrders")} />
                <WrapFilterList arrayFilter={arrayFilterOrders} downloadData={downloadDataOrders} loadingdownload={loadingdownload} loadInitialData={getInitialOrders} setSelected={setParamsFilters} />
            </header>

            <Suspense fallback={null}>
                <DetailOrder order={orderRowData} setOpen={setShowDetail} open={showDetail} />
                {showCancelOrder && <CancelOrderModal getQueryKey={getQueryKey} isShow={showCancelOrder} onClose={() => setShowCancelOrder(false)} order={orderRowData} />}
            </Suspense>

            <Table dataList={orderList} EmptyTable={EmptyMessage} errMsg={String(error)} isError={isError} loadingTable={isLoading} structureColumns={orderColumns} />

            <div className="border-t-1 border-[#a6b4d0] border-opacity-25">{orderList && orderList.length > 0 && <Pagination setPerPage={setLimit} dataForPage={meta} setCurrentPage={setPage} />}</div>
        </div>
    );
}

function EmptyMessage() {
    const { t } = useTranslation();
    return (
        <>
            <h3 className="mt-4 text-center text-xl font-bold text-gray-400 text-opacity-75">{t("shop.noOrders")}</h3>
            <p className="text-center text-15 leading-normal text-gray-400 text-opacity-65">{t("shop.orderText")}</p>
        </>
    );
}
