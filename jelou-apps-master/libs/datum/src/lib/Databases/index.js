import { GridLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import DatabaseCard from "./Commponent/DatabaseCard";
import { DataPic } from "@apps/shared/icons";
import { GridCards } from "../Reports/Components/ReportInfo";
import { DATA_BASE_EL_ROSADO, USERS_EL_ROSADO, homeTabDatabases } from "../constants";
import { ListDataCard } from "../common/DataCardList";
import { SearchAndLayout } from "../common/SearchAndLayout";
import { useDataBases } from "../services/databases";
import { useSearchData } from "../Hooks/searchData";
import { useStructureList } from "../Hooks/estructureList";
import DeleteDatabaseModal from "./Commponent/Modals/DeleteDatabase";

const NUM_DATABASES_SHOWS = 10;

export default function Databases() {
    const [showAllDataBases, setShowAllDataBases] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isBlockViewActive, setIsBlockViewActive] = useState(true);
    const [isListViewActive, setIsListViewActive] = useState(false);

    const databases = useSelector((state) => state.databases);
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company)

    const { t } = useTranslation();
    const navigate = useNavigate();

    const { LoadAllDatabases } = useDataBases();
    const { databasesStructure, databaseSelected, showDeleteDatabaseModal, hasErrorInputName, closeDeleteDatabaseModal } = useStructureList();
    const { handleSearch, searchData } = useSearchData({
        dataForSearch: databases,
        keysForSearch: ["name"],
    });


    useEffect(() => {
        LoadAllDatabases().finally(() => setLoading(false));
    }, [isBlockViewActive]);

    const handleShowDatabaseClick = (evt) => {
        evt.preventDefault();
        setShowAllDataBases((preState) => !preState);
    };

    const handleGoDatosClick = () => {
        navigate("/datum");
    };

    const handleBlockViewCards = () => {
        setLoading(true);
        setIsBlockViewActive(true);
        setIsListViewActive(false);
    };

    const handleListViewCards = () => {
        setLoading(true);
        setIsBlockViewActive(false);
        setIsListViewActive(true);
    };

    const handleNavigateListViewClick = (database) => {
        const { id } = database.original;
        navigate(`/datum/databases/${id}`);
    };

    const viewSearchData = () => {
      let filterViewData = searchData;
      // FIX USER PERMISSION 'El Rosado'
      const havePermision= Object.values(USERS_EL_ROSADO).some(user => user === userSession.id) || company.id === 135;
      if( !havePermision ){ // user id number
        filterViewData = searchData.filter(database => database.id !== DATA_BASE_EL_ROSADO);
      }
      return filterViewData && filterViewData.length > 0 && showAllDataBases === false
                                ? filterViewData.slice(0, NUM_DATABASES_SHOWS).map((dataBase, index) => <DatabaseCard dataBase={dataBase} key={index} />)
                                : filterViewData.map((dataBase, index) => <DatabaseCard dataBase={dataBase} key={index} />)
    }

    if (loading) {
        return (
            <div className="absolute left-0 flex h-full w-full items-center justify-center" id="loading-metrics">
                <GridLoader size={15} color={"#00B3C7"} loading={loading} />
            </div>
        );
    }

    const numShowCardsDatabases = databases.length - NUM_DATABASES_SHOWS;

    return (
        <>
            {showDeleteDatabaseModal && (
                <DeleteDatabaseModal
                    closeModal={closeDeleteDatabaseModal}
                    databaseId={databaseSelected.id}
                    databaseName={databaseSelected.name}
                    isShow={showDeleteDatabaseModal}
                />
            )}
            <section className="py-6 pl-8 pr-12">
                <div className="mb-4 flex items-center justify-between sm:text-[25px]">
                    <h1 className="flex items-start text-xl">
                        <p className="cursor-pointer font-normal text-gray-400 text-opacity-75" onClick={handleGoDatosClick}>
                            {t("dataReport.myData")}
                        </p>
                        <span className="px-2 font-normal text-gray-400 text-opacity-75"> {" / "} </span>
                        <p className="font-bold text-primary-200">{t("dataReport.myDatabases")}</p>
                    </h1>
                    <SearchAndLayout
                        isDatabasesTab={true}
                        handleActiveBlockView={handleBlockViewCards}
                        handleActiveListView={handleListViewCards}
                        handleSearch={handleSearch}
                        isBlockViewActive={isBlockViewActive}
                        isListViewActive={isListViewActive}
                        path={homeTabDatabases}
                        placeholder={t("dataReport.placeholderSearch")}
                    />
                </div>
                {loading === false && searchData && searchData.length === 0 ? (
                    <section className="grid h-screen place-content-center">
                        <DataPic width="30rem" />
                        <p className="pt-4 text-center text-2xl font-semibold text-gray-500">{t("dataReport.empty")}</p>
                    </section>
                ) : isBlockViewActive ? (
                    <>
                        <GridCards>
                            {viewSearchData()}
                        </GridCards>
                        <div className="mt-5 flex justify-end">
                            <button onClick={handleShowDatabaseClick} className="text-base font-bold text-primary-200">
                                {numShowCardsDatabases > 0 &&
                                    (showAllDataBases ? t("dataReport.seeLess") : `${t("dataReport.seeAll")} (${numShowCardsDatabases})`)}
                            </button>
                        </div>
                    </>
                ) : (
                    searchData &&
                    searchData.length > 0 &&
                    isListViewActive && (
                        <div className="overflow-hidden rounded-md">
                            <section className="relative h-[87vh] overflow-y-scroll pr-2">
                                <ListDataCard
                                    datalist={searchData}
                                    handleRowClick={handleNavigateListViewClick}
                                    hasErrorInputName={hasErrorInputName}
                                    isDatabase={true}
                                    structureColums={databasesStructure}
                                />
                            </section>
                        </div>
                    )
                )}
            </section>
        </>
    );
}
