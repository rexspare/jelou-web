import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Tippy from "@tippyjs/react";

import { DateRangePicker } from "./DateRangePicker";
import { RangeFilter } from "./RangeFilter/range";
import { useDateFilter } from "./DateRangePicker/useDate";
import { useRange } from "./RangeFilter/useRange";
import ComboboxSelect from "../../../Clients/Components/Common/Combobox";

export function WrapFilterList({
    arrayFilter = [],
    downloadData,
    isNewProductoOrUpdate,
    isProduct = false,
    loadingdownload = false,
    loadingFilter = false,
    loadInitialData,
    setSelected,
    setsNewProductoOrUpdate,
} = {}) {
    const { t } = useTranslation();
    const [valueLabel, setValueLabel] = useState("");

    const handleDownloadDataTable = () => {
        downloadData({ download: true });
    };

    const {
        loadMaxMinValuesRange,
        handleChange,
        handleClearFilterAll,
        handleClearFilterFields,
        handleClick,
        // handleMaxValueChange,
        // handleMinValueChange,
        maxValue,
        minValue,
        setShowNotification,
        showNotification,
        showRamgePlaceholder,
        valueRange,
    } = useRange({ setSelected });

    const { dataRanges, dateValue, endDate, startDate, rangeSelected, clearDate, onChange, dateChange, clearDateFields, setRangeSelected } =
        useDateFilter({
            setSelected,
        });

    const company = useSelector((state) => state.company);

    useEffect(() => {
        company.properties?.shopCredentials && loadMaxMinValuesRange();
    }, [company.properties?.shopCredentials]);

    useEffect(() => {
        if (isNewProductoOrUpdate) {
            loadMaxMinValuesRange();
            setsNewProductoOrUpdate(false);
        }
    }, [isNewProductoOrUpdate]);

    const handleClearFilters = () => {
        handleClearFilterFields();
        clearDateFields();
        setSelected({});
        setValueLabel("");
        if (valueLabel || valueRange) loadInitialData();
    };

    const clearFilter = (filter) => {
        setSelected((preState) => ({ ...preState, [filter]: "" }));
    };

    const handleChangeComboBox = (selectedOption) => {
        const { value, key, name } = selectedOption;
        setSelected((preState) => ({ ...preState, [key]: value }));
        setValueLabel((preState) => ({ ...preState, [key]: name }));
    };

    return (
        <section className="flex items-end justify-between px-5 py-3">
            <div className="flex gap-4">
                {loadingFilter ? (
                    <>
                        <div className="w-48 h-9">
                            <Skeleton height={23} />
                        </div>
                        <div className="w-48 h-9">
                            <Skeleton height={23} />
                        </div>
                        <div className="w-48 h-9">
                            <Skeleton height={23} />
                        </div>
                        <div className="w-48 h-9">
                            <Skeleton height={23} />
                        </div>
                    </>
                ) : (
                    <>
                        {isProduct && (
                            <div className="block w-64">
                                <RangeFilter
                                    handleChange={handleChange}
                                    handleClearFilter={handleClearFilterAll}
                                    handleClick={handleClick}
                                    // handleMaxValueChange={handleMaxValueChange}
                                    // handleMinValueChange={handleMinValueChange}
                                    maxValue={maxValue}
                                    minValue={minValue}
                                    setShowNotification={setShowNotification}
                                    showNotification={showNotification}
                                    showRamgePlaceholder={showRamgePlaceholder}
                                    valueRange={valueRange}
                                />
                            </div>
                        )}
                        {arrayFilter.length > 0 &&
                            arrayFilter.map((filter, i) => {
                                if (filter.options.length <= 0) return null;
                                return (
                                    <div className="w-64 h-10" key={filter.key + i}>
                                        <ComboboxSelect
                                            options={filter.options}
                                            icon={filter.icon}
                                            value={valueLabel}
                                            placeholder={filter.placeholder}
                                            label={filter.placeholder}
                                            handleChange={handleChangeComboBox}
                                            name={filter.key}
                                            background={"#fff"}
                                            clearFilter={clearFilter}
                                        />
                                    </div>
                                );
                            })}
                        {!isProduct && (
                            <div className="flex flex-1 w-64">
                                <DateRangePicker
                                    clearDate={clearDate}
                                    dataRanges={dataRanges}
                                    dateChange={dateChange}
                                    dateValue={dateValue}
                                    endDate={endDate}
                                    onChange={onChange}
                                    rangeSelected={rangeSelected}
                                    setRangeSelected={setRangeSelected}
                                    startDate={startDate}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="flex gap-1">
                <Tippy arrow={false} className="tippyInfoColors" content={t("shop.clearFilters")} placement={"top"} touch={false}>
                    <button onClick={handleClearFilters} className="flex items-center justify-center rounded-full h-9 w-9 bg-green-960">
                        <svg width={14} height={20} fill="none">
                            <path
                                d="M10.844 19.483c-2.412-.617-4.695-1.48-6.76-2.889l1.673-3.033-.03-.02-2.495 2.424A15.004 15.004 0 0 1 1 13.805l.16-.127c.71-.55 1.435-1.084 2.127-1.654a11.5 11.5 0 0 0 2.448-2.82L5.865 9c2.236 1.291 4.462 2.577 6.704 3.87-1.088 2.076-1.917 4.207-1.725 6.613ZM13.5 10.41c-.188.42-.378.93-.802 1.284-.227.19-.504.125-.758-.022-1.298-.752-2.597-1.5-3.896-2.25-.5-.288-1.002-.576-1.5-.866-.411-.239-.51-.611-.274-1.023.14-.245.278-.492.425-.733.214-.353.602-.46.96-.253C9.483 7.6 11.31 8.654 13.134 9.71c.236.135.359.34.367.701ZM13.665 3.241c-.192-.12-.39-.23-.586-.341-.433-.249-.798-.15-1.049.284l-1.89 3.257c-.125.216-.24.436-.37.667.612.355 1.21.698 1.827 1.056.782-1.358 1.556-2.695 2.319-4.037.18-.314.06-.69-.251-.886ZM2.002 3.256c.25 1.366.895 2.178 1.998 2.487-1.089.33-1.757 1.144-1.998 2.513-.238-1.365-.895-2.17-2.002-2.51 1.114-.33 1.774-1.129 2.002-2.49ZM4.498 1.256c.215.805.688 1.293 1.502 1.505-.807.209-1.287.697-1.502 1.495-.213-.81-.695-1.29-1.498-1.493.798-.207 1.285-.68 1.498-1.507ZM1.99 2.256c-.16-.52-.475-.834-.99-.994.505-.169.834-.476.99-1.006.169.51.476.835 1.01 1.004-.534.157-.839.493-1.01.996Z"
                                fill="#fff"
                            />
                        </svg>
                    </button>
                </Tippy>
                <Tippy arrow={false} className="tippyInfoColors" content={t("shop.download")} placement={"top"} touch={false}>
                    <button onClick={handleDownloadDataTable} className="flex items-center justify-center rounded-full h-9 w-9 bg-primary-200">
                        {loadingdownload ? (
                            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg width={13} height={15} fill="none">
                                <path
                                    d="M5.197 10.721v-.232c0-3.051.001-6.103-.001-9.155 0-.498.191-.893.638-1.155.821-.48 1.901.058 1.953.98.024.435.01.87.01 1.306v8.219l.067.048c.023-.046.037-.1.072-.135.945-.912 1.888-1.826 2.84-2.73.684-.649 1.805-.416 2.133.444.192.503.077.96-.316 1.34-.842.815-1.688 1.626-2.533 2.438l-2.596 2.494c-.572.55-1.328.556-1.915.019-.15-.137-.294-.28-.44-.42l-4.046-3.89c-.229-.22-.457-.438-.682-.66-.511-.508-.507-1.284.007-1.774a1.328 1.328 0 0 1 1.833.01c.947.903 1.887 1.812 2.83 2.718.037.036.075.07.146.135Z"
                                    fill="#fff"
                                />
                            </svg>
                        )}
                    </button>
                </Tippy>
            </div>
        </section>
    );
}
