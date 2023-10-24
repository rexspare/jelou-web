import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { useContext, useState } from "react";
import GridLoader from "react-spinners/GridLoader";
import DocumentOption from "./DocumentOption";
import DownloadIcon from "./Icon/DownloadIcon";
import ExpandIcon from "./Icon/ExpandIcon";
import MinimizeIcon from "./Icon/MinimizeIcon";
import ImageOption from "./ImageOption";

import { ComboboxSelect, MultiCombobox } from "@apps/shared/common";
import { Transition } from "@headlessui/react";
import { Transition as TransitionMenu } from "@tailwindui/react";
import Tippy from "@tippyjs/react";
import { usePopper } from "react-popper";

import { MetricServer } from "@apps/shared/modules";
import { SelectorIcon } from "@heroicons/react/solid";
import { useTranslation } from "react-i18next";
import ChartContainerTitle from "./ChartContainerTitle";
import PeriodPicker from "./PeriodPicker";
// import dayjs from "dayjs";
import { DateContext } from "@apps/context";
import { CloseIcon2, RefreshIcon } from "@apps/shared/icons";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

import { renderHtml } from "../helpers";

const NO_TAGS = ["table", "number", "nodes"];
var fileDownload = require("js-file-download");

const visibleFullscreen = false;

const ChartContainer = (props) => {
    const {
        loading,
        loadingDownload,
        setLoadingDownload,
        period,
        handlePeriodChange,
        startAt,
        endAt,
        setStartAt,
        setEndAt,
        setPeriod,
        exportChart,
        invocationName,
        type,
        id,
        bots = [],
        setBot,
        bot = {},
        companies = [],
        schemaPayload = {},
        companySelect,
        showLabels,
        fullscreen = false,
        multipleBot,
        setMultipleBot,
        botsOptionsAll,
        onClose,
        handleCompany,
        hasCustomFilters,
        customFilters,
        handleCustomChange,
        clearFilters,
        invokeMetric,
        handleCustomParams,
    } = props;

    const dayjs = useContext(DateContext);
    const [showMenu, setShowMenu] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [openDownloadOptions, setOpenDownloadOptions] = useState(false);
    const [visible, setVisible] = useState(false);
    // const [visibleFullscreen, setVisibleFullscreen] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    const { t } = useTranslation();
    const requiresBot = has(schemaPayload, "properties.botId") && bots.length > 1;
    const hasAllBot = has(schemaPayload, "properties.botId.hasAllBot");
    const requiresCompany = has(schemaPayload, "properties.companyId") && companies.length > 1 && !requiresBot;
    const requiresPeriod = has(schemaPayload, "properties.startAt") && has(schemaPayload, "properties.endAt");
    const canDownload = get(schemaPayload, "properties.canDownload", false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [15, 15],
                },
            },
        ],
        placement: "bottom-end",
    });

    const getPeriodName = () => {
        if (period.value === "custom") {
            return `${startAt.format("DD/MMM/YY")} - ${endAt.format("DD/MMM/YY")}`;
        }
        return t(period.label);
    };

    async function downloadChartDocument() {
        const url = invocationName;
        if (!isEmpty(url)) {
            try {
                setLoadingDownload(true);
                let customParams = handleCustomParams();
                const botId = hasAllBot
                    ? multipleBot.map(function (_bot) {
                          return _bot.id;
                      })
                    : bot.id;
                await MetricServer.post(
                    url,
                    {
                        download: 1,
                        companyId: companySelect.id,
                        startAt: startAt.startOf("day").format(),
                        endAt: endAt.endOf("day").format(),
                        botId,
                        period: period.value,
                        ...(!isEmpty(customParams) && customParams),
                    },
                    {
                        responseType: "blob",
                    }
                )
                    .then(async (response) => {
                        const isJsonBlob = (data) => data instanceof Blob && data.type === "application/json";
                        const responseData = isJsonBlob(response?.data) ? await response?.data?.text() : response?.data || {};
                        const responseJson = typeof responseData === "string" ? JSON.parse(responseData) : responseData;
                        // eslint-disable-next-line no-prototype-builtins
                        let existsData = responseJson.hasOwnProperty("data");

                        if (existsData) {
                            const link = document.createElement("a");
                            link.href = responseJson.data.url;
                            document.body.appendChild(link);
                            link.click();
                        } else {
                            fileDownload(responseJson, `report_${dayjs().format()}.xlsx`);
                        }

                        setLoadingDownload(false);
                    })
                    .catch((error) => {
                        setLoadingDownload(false);
                        console.error();
                        //  error;
                    });
            } catch (error) {
                setLoadingDownload(false);
                console.error(error);
            }
        } else {
            return "No esta disponible";
        }
    }

    const companiesOptions = companies.map((company) => ({
        id: company.id,
        value: company.id,
        name: `${company.name}`,
    }));

    const handleBot = (id) => {
        if (hasAllBot) {
            setMultipleBot(id);
        } else {
            setBot(id);
        }
    };
    const isTypeNode = toUpper(type) === "NODES" && fullscreen;
    let containerStyles = isTypeNode ? "px-8 pt-4" : "px-10 pt-8";

    const [showChartDetails, setShowChartDetails] = useState(false);

    return (
        <div className="relative flex h-full w-full flex-col rounded-xl bg-white" id={id}>
            <header className="absolute right-1 z-10 mt-[1.6rem] mr-4 flex items-center justify-end gap-4">
                <button
                    onClick={invokeMetric}
                    className="flex h-10 w-10 items-center justify-center rounded-full shadow-card" // 2.5xl:hidden
                >
                    <RefreshIcon width="1.25rem" height="1.25rem" fill="currentColor" className={`text-primary-200 ${loading ? "animate-spinother" : ""}`} />
                </button>
                <Tippy content={fullscreen ? t("plugins.minimize") : t("plugins.Expandir")} theme="jelou" placement={"bottom"} visible={visibleFullscreen}>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full shadow-card" // 2.5xl:hidden
                        onClick={onClose}
                    >
                        {fullscreen ? (
                            <MinimizeIcon className="fill-current text-primary-200" width="1.25rem" height="1.25rem" />
                        ) : (
                            <ExpandIcon className="fill-current text-primary-200" width="1.25rem" height="1.25rem" />
                        )}
                    </button>
                </Tippy>
            </header>
            <div className={`h-full pb-10 ${containerStyles}`}>
                <div
                    className={`relative ${isTypeNode ? "mb-4 justify-center" : "mb-8 items-center justify-between"} flex
                        ${isTypeNode ? "flex-row justify-between" : "flex-col"}`}
                >
                    <ChartContainerTitle title={props.title} isTypeNode={isTypeNode} fullscreen={fullscreen} description={props.description} setShowChartDetails={setShowChartDetails} />
                    {
                        <div
                            className={`flex flex-wrap items-center justify-start gap-4 ${isTypeNode ? "mr-[6rem]" : ""}
                                ${fullscreen && (type === "number" || type === "table") ? `mr-0` : ``}`}
                        >
                            {fullscreen && (
                                <div>
                                    <input readOnly style={{ outline: "none" }} type="button" name="capture" value="" className="mt-2 w-0 border-transparent focus:border-transparent" />
                                </div>
                            )}
                            {requiresBot && hasAllBot ? (
                                <div className="mr-4 mt-2 flex w-48 rounded-[0.8125rem]">
                                    <MultiCombobox
                                        label={"Bots"}
                                        handleChange={handleBot}
                                        value={multipleBot}
                                        name={"bots"}
                                        options={botsOptionsAll}
                                        background={"#fff"}
                                        hasCleanFilter={false}
                                        hasAllOptions={true}
                                    />
                                </div>
                            ) : (
                                requiresBot && (
                                    <div className="flex w-48 items-center">
                                        <ComboboxSelect options={botsOptionsAll} value={bot} label={"Bots"} handleChange={handleBot} name={"bots"} background={"#fff"} hasCleanFilter={false} />
                                    </div>
                                )
                            )}
                            {requiresCompany && (
                                <div className="mt-2 mr-4 flex">
                                    <div className="mr-4 flex w-48 items-center">
                                        <ComboboxSelect
                                            options={companiesOptions}
                                            value={companySelect}
                                            label={t("selectMessage.company")}
                                            handleChange={handleCompany}
                                            name={"company"}
                                            background={"#fff"}
                                            hasCleanFilter={false}
                                        />
                                    </div>
                                </div>
                            )}
                            {hasCustomFilters &&
                                !isEmpty(customFilters) &&
                                customFilters.map((filter, id) => {
                                    return (
                                        <div key={id} className="mt-2 mr-4 flex w-48 items-center">
                                            {filter.supportAllOptions ? (
                                                <MultiCombobox
                                                    key={id}
                                                    label={get(filter, `placeholder.${lang}`)}
                                                    handleChange={(e) => handleCustomChange(e, filter.keyToSend, filter.supportAllOptions)}
                                                    value={filter.value}
                                                    name={"custom"}
                                                    options={filter.selector}
                                                    background={"#fff"}
                                                    clearFilter={() => clearFilters(filter.keyToSend)}
                                                    hasAllOptions={true}
                                                />
                                            ) : (
                                                <ComboboxSelect
                                                    options={filter.selector}
                                                    key={id}
                                                    value={filter.value}
                                                    label={get(filter, `placeholder.${lang}`)}
                                                    handleChange={(e) => handleCustomChange(e, filter.keyToSend)}
                                                    name={filter.keyToSend}
                                                    background={"#fff"}
                                                    clearFilter={() => clearFilters(filter.keyToSend)}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            {requiresPeriod && (
                                <button
                                    className={`form flex rounded-[0.8125rem] border-1 border-gray-100 pl-4 text-13 font-bold text-primary-200 xl:py-2`}
                                    ref={setReferenceElement}
                                    onClick={() => setShowMenu(!showMenu)}
                                >
                                    <span className="my-auto max-w-cell overflow-hidden overflow-ellipsis">{getPeriodName()}</span>
                                    <span className="ml-1 flex h-full items-center justify-end px-2">
                                        <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </button>
                            )}
                            {(!NO_TAGS.includes(type) || canDownload) && (
                                <div className="relative">
                                    <Tippy content={t("plugins.Descargar")} theme="jelou" placement={"bottom"} visible={visible}>
                                        <button
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-200 shadow-card"
                                            onMouseEnter={() => {
                                                show();
                                            }}
                                            onMouseLeave={() => {
                                                hide();
                                            }}
                                            onClick={() => {
                                                if (!loadingDownload) {
                                                    if (!NO_TAGS.includes(type) && canDownload) {
                                                        setOpenDownloadOptions(!openDownloadOptions);
                                                    } else if (canDownload) {
                                                        downloadChartDocument();
                                                    } else if (!NO_TAGS.includes(type)) {
                                                        exportChart();
                                                    }
                                                }
                                            }}
                                        >
                                            {loadingDownload ? <ClipLoader size={"1.5rem"} color="#00B3C7" /> : <DownloadIcon width="1.25rem" height="1.125rem" />}
                                        </button>
                                    </Tippy>
                                    <TransitionMenu show={openDownloadOptions}>
                                        <div className="fixed inset-0" onClick={() => setOpenDownloadOptions(!openDownloadOptions)} />
                                        <div className="top-14 absolute right-0 z-10 mt-2 flex flex-col items-center justify-center space-y-2">
                                            {!NO_TAGS.includes(type) && (
                                                <TransitionMenu.Child
                                                    enter="transition-opacity ease-linear duration-200"
                                                    enterFrom="opacity-0"
                                                    enterTo="opacity-100"
                                                    leave="transition-opacity ease-linear duration-180"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <ImageOption exportChart={exportChart} setOpenDownloadOptions={setOpenDownloadOptions} openDownloadOptions={openDownloadOptions} />
                                                </TransitionMenu.Child>
                                            )}
                                            {canDownload && (
                                                <TransitionMenu.Child
                                                    enter="transition-opacity ease-linear duration-180"
                                                    enterFrom="opacity-0"
                                                    enterTo="opacity-100"
                                                    leave="transition-opacity ease-linear duration-200"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <DocumentOption
                                                        downloadChartDocument={downloadChartDocument}
                                                        setOpenDownloadOptions={setOpenDownloadOptions}
                                                        openDownloadOptions={openDownloadOptions}
                                                    />
                                                </TransitionMenu.Child>
                                            )}
                                        </div>
                                    </TransitionMenu>
                                </div>
                            )}
                        </div>
                    }
                    <Transition
                        show={showMenu}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        className="relative z-50"
                    >
                        <PeriodPicker
                            period={period}
                            startAt={startAt}
                            setPeriod={setPeriod}
                            setStartAt={setStartAt}
                            endAt={endAt}
                            setPopperElement={setPopperElement}
                            styles={styles}
                            popperElement={popperElement}
                            attributes={attributes}
                            setEndAt={setEndAt}
                            setShowMenu={setShowMenu}
                            handlePeriodChange={handlePeriodChange}
                        />
                    </Transition>
                </div>
                {loading ? (
                    <div className={`${fullscreen ? "h-[31.25rem]" : "h-[18.75rem]"} flex items-center justify-center`}>
                        <GridLoader size={15} color={"#00B3C7"} loading={loading} />
                    </div>
                ) : (
                    <div
                        className={`${
                            fullscreen
                                ? ` flex-1 items-center justify-center ${type === "nodes" ? "h-[calc(100%-50px)]" : "h-[34.375rem] px-3 lg:px-10"}`
                                : type === "nodes"
                                ? "h-[30rem]"
                                : "h-[18.75rem] px-3 lg:px-10"
                        } relative flex justify-center`}
                    >
                        {props.children}
                    </div>
                )}
                {!NO_TAGS.includes(type) && fullscreen && (
                    <div className="relative mt-4 flex items-start justify-end pb-3">
                        <div className="flex h-5 items-center">
                            <input
                                id="comments"
                                aria-describedby="comments-description"
                                name="comments"
                                type="checkbox"
                                style={{ cursor: "pointer" }}
                                onChange={showLabels}
                                className="h-4 w-4 rounded-default border-gray-300 text-primary-200 focus:ring-primary-200"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="comments" className="font-medium text-gray-400">
                                {t("plugins.Mostrar Etiquetas")}
                            </label>
                        </div>
                    </div>
                )}
            </div>

            <div
                className={`absolute inset-0 transition-transform delay-150 duration-700 ease-in-out
                    ${showChartDetails ? "z-10 scale-100" : "scale-0"}
                     rounded-xl bg-white opacity-[.95]`}
            >
                <div className="flex justify-end">
                    <button onClick={() => setShowChartDetails(false)} className="border mt-4 mr-4 p-2">
                        <CloseIcon2 width="1.5rem" height="1.5rem" fill="currentColor" className={`cursor-pointer fill-current ${showChartDetails ? "opacity-100" : "opacity-0"}`} />
                    </button>
                </div>
                <div className="align-center mx-auto flex h-11/12 w-4/5 flex-col justify-center text-center">
                    <h2 className="text-2xl font-semibold text-[#00B3C7]">{props.title}</h2>
                    <span className="mb-14 flex justify-center text-justify text-xl text-gray-400">
                        {props.description && renderHtml(props.description)}
                        {!props.description && t("plugins.noMetricDescription")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChartContainer;
