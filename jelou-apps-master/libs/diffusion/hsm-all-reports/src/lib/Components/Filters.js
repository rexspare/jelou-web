import React, { useState, useRef } from "react";
import orderBy from "lodash/orderBy";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import { useOnClickOutside } from "@apps/shared/hooks";
import "dayjs/locale/es";
import Tippy from "@tippyjs/react";
import { SearchIcon, DateIcon, CleanIcon, DownloadIcon } from "@apps/shared/icons";

import { DateRangePicker, TextFilter, ComboboxSelect } from "@apps/shared/common";

const Filters = (props) => {
    const {
        botOptions,
        statusArray,
        onChange,
        onChangeDate,
        onChangeBot,
        status,
        origin,
        botId,
        onChangeDestination,
        downloadReport,
        destination,
        loadingButton,
        template,
        templateArray,
        onChangeTemplate,
        campaigns,
        selectedCampaign,
        onCampaignChange,
        clearFilterBot,
        clearDate,
        filterOptions,
        clearFilterStatus,
        clearFilterTemplate,
        clearFilterCampaign,
        clearAllFilters,
        originArray,
        onChangeOrigin,
        clearFilterOrigin,
    } = props;
    const { t } = useTranslation();
    const [setShowMenu] = useState(false);
    const ref = useRef();

    useOnClickOutside(ref, () => setShowMenu(false));

    return (
        <div className="flex w-full flex-row">
            <div className="grid w-full grid-cols-3 pb-4 lg:grid-cols-4">
                {botOptions.length > 1 && (
                    <div className="relative mr-6 mb-4">
                        <ComboboxSelect
                            options={orderBy(botOptions, ["name"], ["asc"])}
                            value={botId}
                            placeholder={t("HSMTableFilter.selectbot")}
                            label={t("HSMTableFilter.selectBot")}
                            handleChange={onChangeBot}
                            name={"bot"}
                            background={"#fff"}
                            clearFilter={clearFilterBot}
                        />
                    </div>
                )}
                <div className="mx-2 mr-8 mb-4">
                    <DateRangePicker
                        dateValue={filterOptions.date}
                        icon={<DateIcon width="1rem" height="1.0625rem" fill="#A6B4D0" />}
                        dateChange={onChangeDate}
                        clearDate={clearDate}
                    />
                </div>
                <div className="mr-6">
                    <ComboboxSelect
                        options={statusArray}
                        value={status}
                        placeholder={t("HSMTableFilter.selectstatus")}
                        label={t("HSMTableFilter.selectstatus")}
                        handleChange={onChange}
                        name={"status"}
                        background={"#fff"}
                        clearFilter={clearFilterStatus}
                    />
                </div>
                <div className="mr-6">
                    <ComboboxSelect
                        options={templateArray}
                        value={template}
                        placeholder={t("HSMTableFilter.selecttemplate")}
                        label={t("HSMTableFilter.selecttemplate")}
                        handleChange={onChangeTemplate}
                        name={"template"}
                        background={"#fff"}
                        clearFilter={clearFilterTemplate}
                    />
                </div>
                <div className="mr-6">
                    <ComboboxSelect
                        options={campaigns.map((campaign) => ({
                            ...campaign,
                            id: campaign._id,
                        }))}
                        value={selectedCampaign}
                        placeholder={t("HSMTableFilter.selectcampaign")}
                        label={t("HSMTableFilter.selectcampaign")}
                        handleChange={onCampaignChange}
                        name={"template"}
                        background={"#fff"}
                        clearFilter={clearFilterCampaign}
                    />
                </div>
                <div className="mr-6">
                    <ComboboxSelect
                        options={originArray}
                        value={origin}
                        placeholder={t("HSMTableFilter.origin")}
                        label={t("HSMTableFilter.origin")}
                        handleChange={onChangeOrigin}
                        name={"origin"}
                        background={"#fff"}
                        clearFilter={clearFilterOrigin}
                    />
                </div>
                <div className="relative mx-2 mr-8 mb-2 flex">
                    <TextFilter
                        filter={"number"}
                        onChange={onChangeDestination}
                        value={destination}
                        background={"#fff"}
                        label={t("HSMTableFilter.searchNumber")}
                        icon={<SearchIcon className="fill-current text-gray-100" fill="#A6B4D0" width="0.9375rem" height="0.9375rem" />}
                    />
                </div>
                <div className="col-end-5 mr-6 flex flex-1 items-start justify-end space-x-3">
                    <Tippy content={t("AdminFilters.clean")} theme="jelou" placement={"bottom"} touch={false}>
                        <button
                            id="downloadLink"
                            className="h-8 w-8 rounded-20 border-1 border-transparent bg-green-960 text-white outline-none transition duration-150 ease-in-out focus:outline-none"
                            onClick={clearAllFilters}>
                            <CleanIcon className="fill-current text-white" width="0.844rem" height="1.178rem" />
                        </button>
                    </Tippy>
                    <Tippy content={t("clients.download")} theme="jelou" placement={"bottom"} touch={false}>
                        <button
                            className="color-gradient flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 font-semibold text-white"
                            onClick={downloadReport}>
                            {loadingButton ? (
                                <ClipLoader color={"white"} size="1.1875rem" />
                            ) : (
                                <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />
                            )}
                        </button>
                    </Tippy>
                </div>
            </div>
        </div>
    );
};

export default Filters;
