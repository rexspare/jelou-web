import { useDispatch } from "react-redux";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { addDatabase } from "@apps/redux/store";
import { booleanOptions, INTERNAL_FILTERS_TYPES, NAMES_FILTERS, TYPES_COLUMN, TYPES_FILTER } from "../../../../constants";
import { CloseIcon2, HamburgerIcon, LoadingSpinner } from "@apps/shared/icons";
import { Config } from "./Config";
import { Modal } from "../../Modals/Index";
import { renderMessage } from "@apps/shared/common";
import { useDataBases } from "../../../../services/databases";
import { EmptyColumnModal } from "../ChangeConfigModal";
import MenuOptions from "../MenuOptions";
import { useTranslation } from "react-i18next";
import { MESSAGE_TYPES } from "@apps/shared/constants";

const ColumnsConfig = ({ closeModal, isShow, nameDatabase, descriptionDatabase }) => {
    const [filters, setFilters] = useState([]);
    const [columns, setColumns] = useState([]);
    const [columnSelectToConfig, setColumnSelectToConfig] = useState(null);
    const [showConfig, setShowConfig] = useState(false);
    const [inProcess, setInProcess] = useState(false);

    const [searchIdsFilter, setSearchIdsFilter] = useState([]);
    const [nameColumn, setNameColumn] = useState("");
    const [typeColumn, setTypeColumn] = useState("");

    const [configModal, setConfigModal] = useState({ isShow: false, column: null });
    const [emptyColumn, setEmptyColumnModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const { createDatabase } = useDataBases();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleCreateDatabase = async () => {
        const hasEmptyColumn = columns.find((column) => Boolean(column.id) === true && Boolean(column?.name) === false);

        if (hasEmptyColumn) {
            selectColumn(hasEmptyColumn);
            setEmptyColumnModal(true);
            return;
        }

        setLoading(true);

        const allFilters = getFilters();

        const database = {
            columns,
            description: descriptionDatabase,
            filters: allFilters,
            name: nameDatabase,
            slug: nameDatabase.replace(/\s/g, "").toLowerCase(),
        };

        createDatabase({ database })
            .then(({ databaseCreated, message }) => {
                dispatch(addDatabase(databaseCreated));
                renderMessage(message, MESSAGE_TYPES.SUCCESS);
                closeModal();
            })
            .catch((error) => {
                renderMessage(String(error), MESSAGE_TYPES.ERROR);
            })
            .finally(() => setLoading(false));
    };

    const getFilters = () => {
        const allFilters = [...filters];

        if (searchIdsFilter.length > 0) {
            const searchFilter = {
                name: NAMES_FILTERS.search,
                type: TYPES_FILTER.text,
                order: filters.length,
                columns: searchIdsFilter,
            };

            allFilters.push(searchFilter);
        }
        return allFilters;
    };

    const selectColumn = (column) => {
        const { name = "", type = "" } = column || {};

        setNameColumn(name);
        setTypeColumn(type);
        setColumnSelectToConfig(column);
        setShowConfig(true);
        setInProcess(true);
    };

    const deselectColumn = () => {
        setColumnSelectToConfig(null);
        setShowConfig(false);
        setInProcess(false);
        setNameColumn("");
        setTypeColumn("");
    };

    const handleSaveConfigColumn = ({ checkFilter, OptionsFilter }) => {
        setColumns((preState) =>
            preState.map((column, index) => {
                if (column.id === columnSelectToConfig.id) {
                    return {
                        ...column,
                        name: nameColumn,
                        type: typeColumn,
                        description: "",
                        key: nameColumn.replace(/\s/g, "_"),
                        order: index,
                    };
                }
                return column;
            })
        );

        const type = TYPES_FILTER[typeColumn];

        switch (type) {
            case INTERNAL_FILTERS_TYPES.SEARCH:
                if (checkFilter) {
                    setSearchIdsFilter((preState) => [...preState, { id: columnSelectToConfig.id }]);
                }
                break;

            case INTERNAL_FILTERS_TYPES.OPTIONS:
                {
                    const options = typeColumn === TYPES_COLUMN.boolean ? booleanOptions : OptionsFilter;
                    const filter = {
                        columns: [{ id: columnSelectToConfig.id }],
                        name: nameColumn,
                        order: filters.length,
                        options,
                        type,
                        enabled: checkFilter,
                    };
                    setFilters((preState) => [...preState, filter]);
                }
                break;
            case INTERNAL_FILTERS_TYPES.DATE:
                if (checkFilter) {
                    const filter = {
                        columns: [{ id: columnSelectToConfig.id }],
                        name: nameColumn,
                        order: filters.length,
                        type,
                    };
                    setFilters((preState) => [...preState, filter]);
                }
                break;
        }

        deselectColumn();
    };

    const handleAddColumns = (evt) => {
        evt.preventDefault();

        const colum = {
            id: uuidv4(),
        };

        setColumns((preState) => [...preState, colum]);

        if (nameColumn === "" && typeColumn === "") {
            selectColumn(colum);
        }
    };

    const handleSelectColumnToConfig = (column) => {
        if (columnSelectToConfig === null || (columnSelectToConfig.id !== column.id && inProcess && nameColumn === "" && typeColumn === "")) {
            return selectColumn(column);
        }

        setConfigModal({ isShow: true, column });
    };

    const hanldeDeleteColumn = ({ idColum }) => {
        setColumns((preState) => preState.filter((colum) => colum.id !== idColum));

        if (columnSelectToConfig && columnSelectToConfig.id === idColum) {
            deselectColumn();
        }
    };

    return (
        <Modal closeModal={() => null} isShow={isShow} widthModal="w-full max-w-3xl">
            <section className="relative inline-block h-full w-full max-w-3xl transform overflow-hidden rounded-20 bg-white text-left align-middle font-extrabold text-gray-400 shadow-xl transition-all">
                <div className="flex h-8 items-end justify-end">
                    <button
                        aria-label="Close"
                        className="w-12"
                        onClick={(evt) => {
                            evt.preventDefault();
                            closeModal();
                        }}>
                        <CloseIcon2 />
                    </button>
                </div>
                <header className="pb-4">
                    <h2 className="mb-2 text-center text-xl font-semibold">{t("datum.createDBtext1")}</h2>
                    <div className="flex h-16 w-full items-center justify-center gap-16">
                        <div className="relative flex flex-col items-center justify-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-800 p-1 text-white">1</span>
                            <span className="absolute top-[0.6rem] left-[6rem] -z-10 h-0.5 w-56 bg-primary-800"></span>
                            <h4 className="w-44 truncate text-center font-medium text-primary-800">{t("datum.mainData")}</h4>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-200 p-1 text-white">2</span>
                            <h4 className="truncate font-medium text-primary-200">{t("datum.configureColumns")}</h4>
                        </div>
                    </div>
                </header>
                <main className="grid h-84 grid-cols-2 border-t-0.5 border-b-0.5 border-gray-100 border-opacity-25">
                    <aside className="overflow-y-scroll border-r-0.5 border-gray-100 border-opacity-25">
                        {columns.map((column, index) => {
                            return (
                                <div
                                    onClick={() => handleSelectColumnToConfig(column)}
                                    key={column.id}
                                    className={`grid h-15 w-full cursor-pointer items-center gap-6 border-b-0.5 border-gray-100 border-opacity-25 pl-8 pr-4 ${
                                        column.id === columnSelectToConfig?.id ? "bg-primary-600 bg-opacity-50" : "bg-white"
                                    }`}
                                    style={{ gridTemplateColumns: "auto 1fr auto" }}>
                                    <HamburgerIcon width="15px" height="10px" fill="currentColor" />
                                    <div>
                                        <h5>{column.name || t("datum.column") + " " + (index + 1)}</h5>
                                        <span className="font-medium text-gray-375 text-opacity-50">
                                            {column?.type ? t(`datum.typeColumn.${column?.type}`) : ""}
                                        </span>
                                    </div>
                                    <MenuOptions idColum={column.id} hanldeDeleteColum={hanldeDeleteColumn} />
                                </div>
                            );
                        })}
                        <button onClick={handleAddColumns} className="my-4 ml-8 text-primary-200">
                            + {t("datum.addColumn")}
                        </button>
                    </aside>
                    <Config
                        columns={columns}
                        columnSelectToConfig={columnSelectToConfig}
                        nameColumn={nameColumn}
                        saveColumn={handleSaveConfigColumn}
                        setNameColumn={setNameColumn}
                        setTypeColumn={setTypeColumn}
                        showConfig={showConfig}
                        typeColumn={typeColumn}
                        configModal={configModal}
                        filters={filters}
                        closeModalConfig={() => setConfigModal({ isShow: false, column: null })}
                        selectColumn={selectColumn}
                    />
                </main>

                <footer className="flex h-20 items-center justify-end gap-4 bg-white pr-8">
                    <button
                        type="button"
                        onClick={(evt) => {
                            evt.preventDefault();
                            closeModal();
                        }}
                        className="h-9 rounded-3xl border-transparent bg-gray-10 px-5 text-base font-bold text-gray-400 outline-none">
                        {t("buttons.cancel")}
                    </button>
                    <button
                        onClick={handleCreateDatabase}
                        disabled={columns.length === 0 || loading}
                        className={`button-gradient h-9 ${columns.length === 0 || loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}>
                        {loading ? (
                            <div className="flex justify-center">
                                <LoadingSpinner color="#fff" />
                            </div>
                        ) : (
                            t("bots.createBot")
                        )}
                    </button>
                </footer>
            </section>

            <EmptyColumnModal closeModal={() => setEmptyColumnModal(false)} isShow={emptyColumn} />
        </Modal>
    );
};

export default ColumnsConfig;
