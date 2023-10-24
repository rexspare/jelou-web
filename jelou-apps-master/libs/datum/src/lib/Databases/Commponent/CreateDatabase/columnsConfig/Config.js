import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DataPic, DatumIcon, ErrorIcon } from "@apps/shared/icons";
import { INPUTS_KEYS, FILTERS_INPUTS, TYPES_COLUMN } from "../../../../constants";
import { OpctionsMenu } from "./MenuOptions";
import { SelectFormInput } from "@apps/shared/common";
import ChangeConfigModal from "../ChangeConfigModal";

export function Config({
    showConfig,
    columnSelectToConfig,
    selectColumn,
    columns,
    nameColumn,
    setNameColumn,
    typeColumn,
    setTypeColumn,
    saveColumn,
    configModal,
    filters = [],
    closeModalConfig,
}) {
    const [selectTypeColumn, setSelectTypeColumn] = useState(null);
    const [hasErrorColumnInputs, setHasErrorColumnInputs] = useState({});

    const [optionsFilterList, setOptionsFilterList] = useState([]);
    const [enableCheckFilter, setEnableCheckFilter] = useState(false);
    const [checkFilter, setCheckFilter] = useState(false);

    const showOptions = typeColumn === TYPES_COLUMN.keyword;

    const { t } = useTranslation();

    const clearFileds = () => {
        setSelectTypeColumn(null);
        setCheckFilter(false);
        setEnableCheckFilter(false);
        setHasErrorColumnInputs({});
        setOptionsFilterList([]);
    };

    const handleChangeNameColumn = (evt) => {
        setNameColumn(evt.target.value);
    };

    const handleChageTypeColumn = ({ optionSelected = {} }) => {
        const { value, hasFilter = false } = optionSelected;

        setEnableCheckFilter(hasFilter);
        setTypeColumn(value);
        setSelectTypeColumn(optionSelected);

        setHasErrorColumnInputs({});
    };

    const handleSaveConfigColumn = (evt) => {
        evt.preventDefault();
        if (nameColumn === "" || nameColumn.length <= 3) {
            setHasErrorColumnInputs({ [INPUTS_KEYS.nameColumn]: t("datum.error.moreThat3Character") });
            return;
        }
        if (typeColumn === "") {
            setHasErrorColumnInputs({ [INPUTS_KEYS.typeColumn]: t("datum.error.columnRequired") });
            return;
        }
        if (showOptions && optionsFilterList.length === 0) {
            setHasErrorColumnInputs({ [INPUTS_KEYS.options]: t("datum.error.optionsErrorsEmpty") });
            return;
        }

        setHasErrorColumnInputs({});
        saveColumn({ checkFilter, OptionsFilter: optionsFilterList });
        clearFileds();
    };

    const handleAddOption = (option) => {
        setOptionsFilterList((preState) => [...preState, option]);
    };

    const defaultValueType = FILTERS_INPUTS.find((option) => option.value === columnSelectToConfig?.type) || null;
    const savedOptions = filters.find((filter) => filter?.columns[0]?.id === columnSelectToConfig?.id)?.options || [];

    return (
        <aside className="overflow-y-scroll">
            {showConfig && columnSelectToConfig ? (
                <form onSubmit={(evt) => evt.preventDefault()} className="grid gap-4 px-10 py-8 text-sm font-medium text-gray-400 text-opacity-75">
                    <label className="flex flex-col">
                        {t("datum.fieldName")}
                        <input
                            type="text"
                            autoFocus
                            onChange={handleChangeNameColumn}
                            value={nameColumn || columnSelectToConfig?.name || ""}
                            placeholder={t("datum.placeholders.fieldName")}
                            className={`mt-1 w-full rounded-10 text-15 font-normal placeholder:text-opacity-50 focus:ring-transparent focus-visible:outline-none
                                          ${
                                              hasErrorColumnInputs[INPUTS_KEYS.nameColumn]
                                                  ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
                                                  : "border-none bg-primary-700 focus:border-transparent"
                                          }
                                        `}
                        />
                        {hasErrorColumnInputs[INPUTS_KEYS.nameColumn] && (
                            <div className="flex items-center gap-2 font-medium">
                                <ErrorIcon /> <span className="text-red-1010">{hasErrorColumnInputs[INPUTS_KEYS.nameColumn]}</span>
                            </div>
                        )}
                    </label>
                    <div>
                        <label>
                            {t("datum.type")}
                            <div className="mb-4">
                                <SelectFormInput
                                    inputHasError={Boolean(hasErrorColumnInputs[INPUTS_KEYS.typeColumn])}
                                    messageInputError={hasErrorColumnInputs[INPUTS_KEYS.typeColumn]}
                                    value={selectTypeColumn ?? defaultValueType}
                                    isSearchable={false}
                                    keyInput="typeColumn"
                                    placeholder={t("datum.placeholders.type")}
                                    onChange={handleChageTypeColumn}
                                    options={FILTERS_INPUTS}
                                    type="selectColumn"
                                />
                            </div>
                        </label>
                        {showOptions && (
                            <OpctionsMenu
                                hasError={hasErrorColumnInputs[INPUTS_KEYS.options]}
                                onChange={handleAddOption}
                                savedOptions={savedOptions}
                            />
                        )}
                        {enableCheckFilter && (
                            <label className="flex items-center w-24 gap-3 font-bold cursor-pointer">
                                <input
                                    onChange={(evt) => setCheckFilter(evt.target.checked)}
                                    value={checkFilter}
                                    checked={checkFilter}
                                    type="checkbox"
                                    className="cursor-pointer rounded-default border-primary-200 text-primary-200 focus:ring-transparent"
                                />
                                {t("datum.filter")}
                            </label>
                        )}
                    </div>
                    <footer className="flex justify-end w-full">
                        <button
                            className="flex items-center justify-center w-24 h-8 py-1 text-left rounded-full cursor-pointer border-1 border-primary-200 text-primary-200"
                            onClick={handleSaveConfigColumn}
                            type="button">
                            {t("buttons.save")}
                        </button>
                    </footer>
                </form>
            ) : columns.length > 0 ? (
                <div className="grid h-full place-content-center">
                    <DatumIcon />
                    <h4 className="mb-1 text-xl font-bold text-center text-gray-400 ">{t("datum.createColumnText1")}</h4>
                    <p className="text-sm font-normal text-center text-gray-400">{t("datum.createColumnText2")}</p>
                </div>
            ) : (
                <div className="grid h-full place-content-center">
                    <DataPic width="15rem" />
                    <h4 className="mb-1 text-xl font-bold text-center text-gray-400 ">{t("datum.createDBtext1")}</h4>
                    <p className="text-sm font-normal text-center text-gray-400 w-60">{t("datum.createDBtext2")}</p>
                </div>
            )}

            <ChangeConfigModal clearFileds={clearFileds} closeModalConfig={closeModalConfig} configModal={configModal} selectColumn={selectColumn} />
        </aside>
    );
}
