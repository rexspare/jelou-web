import { createContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GridLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import Lottie from "react-lottie";

import { renderMessage, SectionWrapper } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { DataPic, LeftArrow } from "@apps/shared/icons";

import { Header } from "./Header";
import { TablaDB } from "./Table";
import { Filters } from "../Commponent/Filters";
import { useRowData } from "../services/rowData";
import { useDataBases } from "../../services/databases";
import { useParamsForFilters } from "../Hook/use-params-for-filters/useParamsForFilters";
import uploadingDataAnimation from "../Animations/UploadingData.json";
import { UploadFileError } from "../Commponent/Modals/UploadFileError";
import DownloadPanel from "../Download";
import DataManagmentContextProvider from "../../context/DataManagmentContext";
import { useSelector } from "react-redux";
import { DATA_BASE_EL_ROSADO, USERS_EL_ROSADO } from "../../constants";

export const RowsTableData = createContext({ error: "no access" });
export const ShowAnimationContext = createContext({ showUploadingDataAnimation: false });
export const ErrorBoundaryContext = createContext({ hasUploadFileError: false })

export default function DatabaseTable() {
    const { t } = useTranslation();
    const { databaseId } = useParams();
    const { getOneDatabase } = useDataBases();
    const { getRowOfTable } = useRowData();
    const { state: paramsFilters, dispatchForFilters } = useParamsForFilters();
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company)
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [paginationData, setPaginationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(true);
    const [rowOfTable, setRowOfTable] = useState(null);
    const [oneDataBase, setOneDataBase] = useState(null);
    const [showUploadingDataAnimation, setShowUploadingDataAnimation] = useState(false);
    const [hasUploadFileError, setHasUploadFileError] = useState(false);

    const navigate = useNavigate();

    const closeErrorModal = () => setHasUploadFileError(false);


    useEffect (()=>{
        const havePermision = (Object.values(USERS_EL_ROSADO).some(user => user === userSession.id)) || company.id === 135;
        const isDataBaseELROSADO = Number(databaseId) === DATA_BASE_EL_ROSADO;

        if(isDataBaseELROSADO && !havePermision){
            navigate('/datum/databases');
        }
    }, [userSession]);

    const refreshTable = () => {
        getRowOfTable({ databaseId, limit, page, paramsFilters })
            .then((row) => {
                const { results, pagination } = row;
                setPaginationData(pagination);
                setRowOfTable(results ?? []);
            })
            .catch((error) => {
                renderMessage(String(error), MESSAGE_TYPES.ERROR);
                console.error(error);
                setRowOfTable([]);
            })
            .finally(() => setLoadingTable(false));
    };

    const getData = (start = false, reload = false) => {
        if (!start) setLoadingTable(true);
        getOneDatabase({ databaseId })
            .then((database) => {
                setOneDataBase(database);
                if (reload) {
                    refreshTable();
                }
            })
            .catch((error) => {
                renderMessage(String(error), MESSAGE_TYPES.ERROR);
                setOneDataBase(undefined);
                console.error(error);
            })
            .finally(() => {
                if (start) setLoading(false);
                if (!start) setLoadingTable(false);
            });
    };

    useEffect(() => {
        if (isEmpty(databaseId)) return;
        setLoading(true);
        getData(true);
    }, [databaseId]);

    useEffect(() => {
        if (isEmpty(databaseId)) return;
        setLoadingTable(true);
        refreshTable();
    }, [databaseId, limit, page, paramsFilters]);

    if (showUploadingDataAnimation) {
        return (
            <main className="flex h-screen items-center justify-center">
                <div className="w-376px h-359px absolute">
                    <Lottie
                        className="text-primary-200"
                        options={{ animationData: uploadingDataAnimation, loop: true, autoplay: true }}
                        width={256}
                        height={256}
                    />
                    <div>
                        <p className="text-center text-2xl font-normal text-gray-400">
                            <span>{`${t("datum.uploadBulkDataMessage1")} `}</span>
                            <span className="font-bold text-primary-200">{t("datum.uploadBulkDataMessage2")}</span>
                        </p>
                        <p className="text-center text-sm leading-7 text-gray-400">{t("datum.uploadBulkDataMessage3")}</p>
                    </div>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <div className="absolute left-0 flex h-full w-full items-center justify-center" id="loading-metrics">
                <GridLoader size={15} color={"#00B3C7"} loading={loading} />
            </div>
        );
    }

    return (
        <SectionWrapper className="py-6 pl-8 pr-12">
          <DataManagmentContextProvider>
            <RowsTableData.Provider value={{ setRowOfTable, dispatchForFilters }}>
                <ShowAnimationContext.Provider value={{ setShowUploadingDataAnimation }}>
                    <ErrorBoundaryContext.Provider value={{ setHasUploadFileError }}>
                        <Header oneDataBase={oneDataBase} loadingRefresh={loadingTable} getData={getData} />
                        {typeof oneDataBase === "undefined" ? (
                            <section className="grid h-screen place-content-center gap-6">
                                <DataPic width="30rem" />
                                <div className="grid gap-3">
                                    <p className="text-center text-2xl font-semibold text-gray-500">{t("dataReport.empty")}</p>
                                    <Link to="/datum/databases" className="flex justify-center">
                                        <span className="flex w-48 items-center justify-center gap-2 whitespace-nowrap rounded-3xl bg-primary-200 p-2 text-center font-bold text-white">
                                            <LeftArrow fill="currentColor" className="mt-1 -rotate-180" width="10" height="8" />
                                            {t("datum.backToBoard")}
                                        </span>
                                    </Link>
                                </div>
                            </section>
                        ) : (
                            <>
                                <Filters resetPagination={() => setPage(1)} filters={oneDataBase?.filters ?? []} />
                                <TablaDB
                                    loading={loadingTable}
                                    currentPage={page}
                                    setPage={setPage}
                                    setLimit={setLimit}
                                    paginationData={paginationData}
                                    rowOfTable={rowOfTable ?? []}
                                    oneDataBase={oneDataBase}
                                />
                            </>
                        )}
                        {hasUploadFileError && <UploadFileError showModal={hasUploadFileError} closeModal={closeErrorModal} />}
                        <DownloadPanel />
                    </ErrorBoundaryContext.Provider>
                </ShowAnimationContext.Provider>
            </RowsTableData.Provider>
          </DataManagmentContextProvider>
        </SectionWrapper>
    );
}
