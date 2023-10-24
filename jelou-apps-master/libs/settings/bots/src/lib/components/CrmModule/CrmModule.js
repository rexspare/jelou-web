import { DiaryIcon, HamburgerIcon, SavedIcon, WarningIcon1 } from "@apps/shared/icons";
import first from "lodash/first";
// import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { v4 as uuidv4 } from "uuid";
import MenuOptions from "./MenuOptions";

import { mergeById } from "@apps/shared/utils";
import ChangeColumnModal from "./ChangeColumnModal";
import ColumnToConfig from "./ColumnToConfig";
import DeleteColumnModal from "./DeleteColumnModal";

const CrmModule = (props) => {
    const {
        disableUpdateCRM,
        setDisableUpdateCRM,
        showSavingWarning,
        setShowSavingWarning,
        columnSelectToConfig,
        setColumnSelectToConfig,
        configSettingsBody,
        setConfigInProcess,
        configInProcess,
        allBotConfig,
        handleSubmitConfig,
        notify,
        notifyError,
    } = props;
    const [columns, setColumns] = useState([]);
    const [showChangeColumnModal, setShowChangeColumnModal] = useState(false);
    const [nextColumn, setNextColumn] = useState("");
    const [openDeleteColumnModal, setOpenDeleteColumnModal] = useState(false);
    const [columnToDelete, setColumnToDelete] = useState(null);
    const [initialSettingsValue, setInitialSettingsValue] = useState({});

    const columnsRef = useRef();

    const getCRMConfig = () => {
        setDisableUpdateCRM(true);
        const sidebarSettingsCopy = first(allBotConfig.filter((configObj) => configObj.key === "sidebar_settings"));
        if (sidebarSettingsCopy) {
            setInitialSettingsValue(sidebarSettingsCopy);
        } else {
            setInitialSettingsValue({
                key: "sidebar_settings",
                typeOf: "array",
                value: [],
                unity: null,
                module: "PMA",
            });
        }

        if (!isEmpty(sidebarSettingsCopy) && sidebarSettingsCopy !== undefined) {
            setColumns(sidebarSettingsCopy.value);
            columnsRef.current = [...sidebarSettingsCopy.value];
        } else {
            setColumns([]);
            columnsRef.current = [];
        }
    };

    useEffect(() => {
        getCRMConfig();
    }, [allBotConfig]);

    const onConfirm = () => {
        handleSubmitConfig();
    };

    const { t } = useTranslation();

    const handleAddColumns = (evt) => {
        evt.preventDefault();
        const column = {
            id: uuidv4(),
            label: "",
            name: "",
            rules: {
                rules: "",
                isObligatory: false,
            },
            type: "",
        };

        setColumns((prev) => [...prev, column]);
        setColumnSelectToConfig(column);
    };

    const handleDeleteColumn = (idColum, columnName) => {
        setDisableUpdateCRM(false);
        setOpenDeleteColumnModal(true);
        setColumnToDelete({ idColum, columnName });
    };

    const confirmDeleteColumn = () => {
        const filteredColumns = columns.filter((column) => column.id !== columnToDelete.idColum);
        // let settingsCopy = first(get(settingsBody, "settings", []));
        let settingsBase = {
            key: "sidebar_settings",
            typeOf: "array",
            value: [],
            unity: null,
            module: "PMA",
        };

        settingsBase.value = [...filteredColumns];
        // const filteredSettings = { ...settingsCopy, value: filteredColumns };

        configSettingsBody("settings", [settingsBase]);
        if (!isEmpty(columns)) {
            setColumnSelectToConfig(filteredColumns[0]);
        } else {
            setColumnSelectToConfig(null);
        }
        setShowSavingWarning(true);
        setColumns(filteredColumns);
        setConfigInProcess(false);
        setOpenDeleteColumnModal(false);
    };

    useEffect(() => {
        if (columns.length > 0 && columnSelectToConfig === null) {
            setColumnSelectToConfig(columns[0]);
        }
    }, [columns]);

    const handleColumnChange = (columnPayload) => {
        const mergedColumns = mergeById(columns, columnPayload, "id");

        setColumns(mergedColumns);

        const settingsBodyCopy = { ...initialSettingsValue };
        settingsBodyCopy.value = mergedColumns;
        configSettingsBody("settings", [settingsBodyCopy]);
        setDisableUpdateCRM(false);
    };

    const selectColumn = (column) => {
        if (configInProcess) {
            setShowChangeColumnModal(true);
            setNextColumn(column);
            return;
        }
        setColumnSelectToConfig(column);
    };

    const onConfirmChangeColumn = () => {
        setColumnSelectToConfig(nextColumn);
        setShowChangeColumnModal(false);
        setConfigInProcess(false);
        setDisableUpdateCRM(true);
    };

    const closeColumnChangeModal = () => {
        setShowChangeColumnModal(false);
    };

    const handleSelectColumnToConfig = (column) => {
        selectColumn(column);
    };

    return (
        <>
            <div className="flex items-center justify-between  border-b-0.5 border-gray-5 py-8 pl-10 pr-6">
                <div className="flex items-center">
                    <DiaryIcon className={"mr-4 text-primary-200"} width="1.2rem" height="1.2rem" />
                    <p className={`text-base font-bold text-primary-200`}>{t("CRM")}</p>
                </div>
            </div>

            <div className=" h-[85%]  overflow-y-auto">
                <div className="grid h-[80%] grid-cols-3 ">
                    <aside className="overflow-y-scroll border-r-0.5 border-gray-100 border-opacity-25">
                        {columns.map((column, index) => {
                            return (
                                <div
                                    onClick={() => handleSelectColumnToConfig(column)}
                                    key={column.id}
                                    className={`grid min-h-[5.3rem] w-full cursor-pointer items-center gap-6 border-b-0.5 border-gray-100 border-opacity-25 pl-8 pr-4 ${
                                        column.id === columnSelectToConfig?.id ? "bg-primary-600 bg-opacity-50" : "bg-white"
                                    } `}
                                    style={{ gridTemplateColumns: "auto 1fr auto" }}
                                >
                                    <HamburgerIcon width="15px" height="10px" fill="currentColor" />
                                    <div>
                                        <h5
                                            style={{ overflowWrap: "anywhere" }}
                                            className={column.id === columnSelectToConfig?.id ? "text-base font-bold text-gray-400" : "text-base font-bold text-gray-400 text-opacity-65 "}
                                        >
                                            {column.label || t("settings.crm.field") + " " + (index + 1)}
                                        </h5>
                                    </div>
                                    <MenuOptions idColum={column.id} hanldeDeleteColum={() => handleDeleteColumn(column.id, column.name)} />
                                </div>
                            );
                        })}
                        <button onClick={handleAddColumns} className="my-4 ml-8 text-primary-200">
                            + {t("settings.crm.addFile")}
                        </button>
                    </aside>
                    <aside className="col-span-2 overflow-y-scroll">
                        {columnSelectToConfig && (
                            <ColumnToConfig
                                configInProcess={configInProcess}
                                setShowSavingWarning={setShowSavingWarning}
                                notifyError={notifyError}
                                notify={notify}
                                setConfigInProcess={setConfigInProcess}
                                handleColumnChange={handleColumnChange}
                                columnInfo={columnSelectToConfig}
                            />
                        )}
                    </aside>
                </div>
                <div className={`flex justify-between border-t-0.5 border-gray-5 py-4 pr-6`}>
                    {showSavingWarning ? (
                        <div className="flex gap-4 px-[3rem]">
                            <div className="flex justify-center">
                                <WarningIcon1 />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold text-[#F6A505]">{t("settings.crm.warnUpdatesCrm")}</p>
                                <p className="text-[#727C94]">{t("settings.crm.warnNotSave")}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4 px-[3rem]">
                            <div className="flex justify-center">
                                <SavedIcon width={"1.5rem"} />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold text-primary-200">{t("settings.crm.updatesUpToDay")}</p>
                                <p className="text-gray-400">{t("settings.crm.warnToPublish")}</p>
                            </div>
                        </div>
                    )}
                    <div className="mt-6 flex items-center text-center md:mt-0">
                        <button disabled={disableUpdateCRM} type="submit" className="button-primary h-10 w-32" onClick={onConfirm}>
                            {t("settings.crm.publish")}
                        </button>
                    </div>
                </div>
                {showChangeColumnModal && <ChangeColumnModal onConfirm={onConfirmChangeColumn} closeModal={closeColumnChangeModal} />}
                {openDeleteColumnModal && <DeleteColumnModal columnName={columnToDelete.columnName} setOpen={setOpenDeleteColumnModal} onConfirm={confirmDeleteColumn} />}
            </div>
        </>
    );
};

export default CrmModule;
