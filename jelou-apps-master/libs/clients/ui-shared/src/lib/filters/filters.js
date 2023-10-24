import Tippy from "@tippyjs/react";
import "dayjs/locale/es";
import get from "lodash/get";
import React, { useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";

import { ComboboxSelect, DateRangePicker, GlobalSearch } from "@apps/shared/common";
import { CleanIcon, DownloadIcon } from "@apps/shared/icons";

import { ClientStateContext } from "@apps/clients-state-context";

const Filters = (props) => {
    const { selectedOptions, setSelectedOptions, filters, showDownload, downloadUsers, loadingDownload, clearFilters, query, setQuery, field, setField, search } = props;

    const { t } = useTranslation();
    const searchButton = useRef();

    const { ClearStateChooseChat } = useContext(ClientStateContext);

    const dateChange = (range) => {
        let [startDate, endDate] = range;
        setSelectedOptions({ ...selectedOptions, date: [startDate, endDate] });
    };

    const clearDate = () => {
        setSelectedOptions({ ...selectedOptions, date: [] });
    };

    const clearFilter = (filter) => {
        setSelectedOptions({ ...selectedOptions, [filter]: [] });
    };
    const onChannelPrivate = (options, name) => {
        const channelsPrivates = ["facebook", "instagram", "twitter", "whatsapp", "widget"];
        if (name === "channel") {
            const channels = options.filter((item) => channelsPrivates.includes(item.name.toLowerCase()));
            return channels;
        } else if (name === "bots") {
            const bots = options.filter((item) => channelsPrivates.includes(item.type.toLowerCase()));
            return bots;
        } else {
            return options;
        }
    };
    return (
        <div className="flex flex-1 justify-between py-3 px-2">
            <div className="relative flex items-center">
                <GlobalSearch
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    query={query}
                    setQuery={setQuery}
                    field={field}
                    setField={setField}
                    search={search}
                    searchButton={searchButton}
                    typeSearchBy={search}
                    actionOnSearch={ClearStateChooseChat}
                />
                {filters.map((filter) => (
                    <div key={filter.id} className={`relative flex min-w-[16rem] items-center`}>
                        <div className={`mx-3 flex w-full items-center`}>
                            {get(filter, "type", "") === "Date" ? (
                                <DateRangePicker dateValue={selectedOptions.date} icon={filter.icon} dateChange={dateChange} clearDate={clearDate} right={true} />
                            ) : (
                                <ComboboxSelect
                                    options={onChannelPrivate(filter.options, filter.name)}
                                    icon={filter.icon}
                                    value={filter.value}
                                    placeholder={filter.placeholder}
                                    label={filter.placeholder}
                                    handleChange={filter.onChange}
                                    name={filter.name}
                                    background={"#fff"}
                                    clearFilter={clearFilter}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end space-x-2 pl-4">
                <Tippy content={t("AdminFilters.clean")} placement={"bottom"} theme={"jelou"} touch={false}>
                    <button className="flex h-[1.90rem] w-[1.90rem] items-center justify-center rounded-full bg-green-960 focus:outline-none" onClick={clearFilters}>
                        <CleanIcon className="fill-current text-white" width="0.844rem" height="1.178rem" />
                    </button>
                </Tippy>
                {showDownload && (
                    <Tippy content={t("HSMTableFilter.download")} placement={"bottom"} theme={"jelou"} touch={false}>
                        <button onClick={downloadUsers} className="flex h-[1.90rem] w-[1.96rem] items-center justify-center rounded-full bg-primary-200 focus:outline-none" disabled={loadingDownload}>
                            {loadingDownload ? <ClipLoader color={"white"} size="1.1875rem" /> : <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />}
                        </button>
                    </Tippy>
                )}
            </div>
        </div>
    );
};

export default Filters;
