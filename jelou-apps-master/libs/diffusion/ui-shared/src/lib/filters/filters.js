import { useOnClickOutside } from "@apps/shared/hooks";
import { ArrowIcon, CleanIcon, DateIcon, DownloadIcon, SearchIcon } from "@apps/shared/icons";
import Tippy from "@tippyjs/react";
import "dayjs/locale/es";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { BeatLoader, ClipLoader } from "react-spinners";

import { ComboboxSelect, DateRangePicker, TextFilter } from "@apps/shared/common";
import { Link } from "react-router-dom";

const Filters = (props) => {
    const {
        // botOptions,
        statusArray,
        onChange,
        onChangeDate,
        // onChangeBot,
        status,
        origin,
        // botId,
        onChangeDestination,
        downloadReport,
        destination,
        loadingButton,
        // template,
        // templateArray,
        // onChangeTemplate,
        // campaigns,
        // selectedCampaign,
        // onCampaignChange,
        // clearFilterBot,
        clearDate,
        filterOptions,
        clearFilterStatus,
        // clearFilterTemplate,
        // clearFilterCampaign,
        clearAllFilters,
        originArray,
        onChangeOrigin,
        clearFilterOrigin,
        isSpecificCampaign = false,
        campaignInfo,
    } = props;
    const { t } = useTranslation();
    const [setShowMenu] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const ref = useRef();
    useOnClickOutside(ref, () => setShowMenu(false));

    const statusColor = {
        CANCELLED: "bg-[#FFF3CE] text-[#D39C00]",
        COMPLETED: "bg-green-20 text-green-960",
        SUCCESSFUL: "bg-[#DEF1EE] text-[#209F8B]",
        SCHEDULED: "bg-[#D9F4F7] text-[#00B3C7]",
        REJECTED: "bg-red-1040 text-red-1030",
        PENDING: "bg-[#E4E8EE] text-[#727C94]",
        IN_PROGRESS: "bg-gray-10 text-gray-400",
        FAILED: "bg-red-200 text-red-1000",
    };

    const Badge = (value) => {
        return <span className={`rounded-xl px-3 py-1 font-bold capitalize ${statusColor[value.value.status]}`}>{t(`hsm.${toLower(value.value.status)}`)}</span>;
    };

    const loadingQuantity = (color = "#727c94") => {
        return <BeatLoader color={color} size={8} />;
    };

    useEffect(() => {
        if (!isEmpty(campaignInfo)) {
            setLoadingData(false);
        }
    }, [campaignInfo]);

    return (
        <div className="mb-5 flex w-full flex-row border-b-default border-gray-100/50 pl-3 pr-7">
            <div className="flex flex-col">
                <Link
                    to={{ pathname: `/hsm/campaigns` }}
                    className="mr-1 flex min-w-20 cursor-pointer items-center rounded-full px-2 pb-2 font-bold text-primary-200 hover:text-primary-250 focus:outline-none"
                >
                    <ArrowIcon width="1.8rem" height="1.8rem" fill={"currentColor"} className={"text-inherit"} />
                    {loadingData ? loadingQuantity() : <p className="ml-2 whitespace-nowrap text-xl font-bold">{campaignInfo.name}</p>}
                </Link>
                <div className="ml-[18px] mb-3">
                    {!loadingData && (
                        <div className="ml-2">
                            <Badge value={campaignInfo} />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex w-full flex-row-reverse py-4">
                <div className="flex items-center justify-center space-x-2">
                    <Tippy content={t("AdminFilters.clean")} placement={"bottom"} touch={false}>
                        <button
                            id="downloadLink"
                            className="h-8 w-8 rounded-20 border-1 border-transparent bg-green-960 text-white outline-none transition duration-150 ease-in-out focus:outline-none"
                            onClick={clearAllFilters}
                        >
                            <CleanIcon className="fill-current text-white" width="0.844rem" height="1.178rem" />
                        </button>
                    </Tippy>
                    <Tippy content={t("clients.download")} placement={"bottom"} touch={false}>
                        <button className="color-gradient flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 font-semibold text-white" onClick={downloadReport}>
                            {loadingButton ? <ClipLoader color={"white"} size="1.1875rem" /> : <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />}
                        </button>
                    </Tippy>
                </div>

                {!isSpecificCampaign && (
                    <div className="mr-6 min-w-[20%]">
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
                )}

                <div className="mr-6 min-w-[20%]">
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
                <div className="relative ml-2 mr-8 mb-2 flex min-w-[20%]">
                    <TextFilter
                        filter={"number"}
                        onChange={onChangeDestination}
                        value={destination}
                        background={"#fff"}
                        label={t("HSMTableFilter.searchNumber")}
                        icon={<SearchIcon className="fill-current text-gray-100" fill="#A6B4D0" width="0.9375rem" height="0.9375rem" />}
                    />
                </div>
                {!isSpecificCampaign && (
                    <div className="mx-2 mr-8 mb-4 min-w-[20%]">
                        <DateRangePicker dateValue={filterOptions.date} icon={<DateIcon width="1rem" height="1.0625rem" fill="#A6B4D0" />} dateChange={onChangeDate} clearDate={clearDate} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filters;
