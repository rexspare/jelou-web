import { useState, useEffect } from "react";
import axios from "axios";
import get from "lodash/get";
import isNil from "lodash/isNil";
import isEmpty from "lodash/isEmpty";
import FileDownload from "js-file-download";
import { useTranslation } from "react-i18next";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useParams } from "react-router-dom";
import { Filters, Stats } from "@apps/diffusion/ui-shared";
import HsmTable from "./Components/HsmTable";
import { JelouApiV1 } from "@apps/shared/modules";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";

const DiffusionHsmReports = (props) => {
    const { allowedPermission, initialFiltersReports, filterOptions, setFilterOptions, bots } = props;
    const { campaignId } = useParams();
    const campaignDate = localStorage.getItem("campaignDate");

    // const [bots, setBots] = useState([]);
    const [cancelToken, setCancelToken] = useState();
    const { t } = useTranslation();
    const [isOpenDate, setIsOpenDate] = useState(false);
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());
    const [loadingWidgets, setLoadingWidgets] = useState(false);
    const [data, setData] = useState([]);
    const [totalResults, setTotalResults] = useState("--");
    const [pageLimit, setPageLimit] = useState(1);
    const [row, setRows] = useState(20);
    // const [botId, setBotId] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState({});
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [campaignInfo, setCampaignInfo] = useState({});
    const botUrl = campaignId.split(":")[1];
    const campaignIdUrl = campaignId.split(":")[0];

    const ALL_ELEMENTS = {
        id: -1,
        name: t("AdminFilters.all"),
        value: -1,
    };

    const ALL = [
        {
            id: -1,
            name: t("AdminFilters.all"),
            value: -1,
        },
    ];

    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(ALL_ELEMENTS);
    const [templateArray, setTemplateArray] = useState(ALL);

    const [status, setStatus] = useState(ALL_ELEMENTS);
    const [origin, setOrigin] = useState({
        id: 2,
        label: "BULK",
        name: t("HSMTable.BULK"),
        value: 2,
    }); // ALL_ELEMENTS
    const [template, setTemplate] = useState(ALL_ELEMENTS);

    const [destination, setDestination] = useState("");
    const [maxPage, setMaxPage] = useState(null);
    const [buttonAvailable, setButtonAvailable] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);

    const available = buttonAvailable
        ? "button-primary cursor-pointer"
        : "h-9 inline-flex justify-center rounded-md border-1 border-gray-300 px-4 py-2 bg-white text-gray-300 bg-white shadow-sm cursor-not-allowed";

    const statusArray = [
        {
            id: -1,
            name: t("AdminFilters.all"),
            value: -1,
        },
        {
            id: 1,
            label: "DELIVERED_USER",
            name: t("HSMTable.deliveredUser"),
            value: 1,
        },
        {
            id: 2,
            label: "DELIVERED_CHANNEL",
            name: t("HSMTable.delivered"),
            value: 2,
        },
        // {
        //     id: 3,
        //     label: "CREATED",
        //     name: t("HSMTable.created"),
        //     value: 3,
        // },
        {
            id: 4,
            label: "FAILED",
            name: t("HSMTable.failed"),
            value: 4,
        },
    ];

    const originArray = [
        {
            id: -1,
            name: t("AdminFilters.all"),
            value: -1,
        },
        {
            id: 1,
            label: "API",
            name: t("HSMTable.API"),
            value: 1,
        },
        {
            id: 2,
            label: "BULK",
            name: t("HSMTable.BULK"),
            value: 2,
        },
    ];

    useEffect(() => {
        searchReportGeneralData();
    }, [row, pageLimit]);

    useEffect(() => {
        setPageLimit(1);
        setRows(20);
        if (filterOptions !== initialFiltersReports) {
            searchReportGeneralData();
        } else {
            setData([]);
            setLoadingFilters(false);
        }
    }, [filterOptions]);

    useEffect(() => {
        !isNil(campaignDate) && setFilterOptions({ ...filterOptions, date: [campaignDate, filterOptions["date"][1]] });
    }, [campaignDate]);

    const searchReportGeneralData = async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Operation canceled due to new request.");
        }
        try {
            if (!isEmpty(botUrl)) {
                setIsLoading(true);
                setButtonAvailable(true);
                setLoadingWidgets(true);
                const source = axios.CancelToken.source();
                setCancelToken(source);

                const date = get(filterOptions, "date", []);
                const status = get(filterOptions, "status", []);
                const template = get(filterOptions, "template", []);
                const destination = get(filterOptions, "destination", []);
                const origin = get(filterOptions, "origin", { id: -1 });

                let startAt, endAt;
                //bot: [], date: [], status: [], template: [], campaign: [], destination: []
                if (!isEmpty(date)) {
                    [startAt, endAt] = date;
                    startAt = dayjs(startAt).format();
                    endAt = dayjs(endAt).endOf("day").format();
                }
                const { data } = await JelouApiV1.get(`/bots/${botUrl}/notifications`, {
                    params: {
                        limit: row,
                        ...(!isEmpty(status) && status.id === -1 ? {} : { status: status.label }),
                        ...(!isEmpty(destination) ? { destination } : {}),
                        ...(!isEmpty(template) && template.id === -1 ? {} : { elementName: template.elementName }),
                        ...(!isEmpty(origin) && origin.id === -1 ? {} : { origin: origin.label }),
                        ...(!isEmpty(campaignIdUrl) ? { campaignId: campaignIdUrl } : {}),
                        from: startAt,
                        to: endAt,
                        page: pageLimit,
                    },
                    cancelToken: source.token,
                });
                getCampaingName();
                if (!isEmpty(data.results)) {
                    const parsedData = data.results; // addCampaignName(data.results, campaignsList);
                    setData(parsedData);
                    setMetadata(data._metadata);
                    setTotalResults(data.pagination.total);
                    setMaxPage(data.pagination.totalPages);
                } else {
                    setData([]);
                    setMetadata({});
                    setTotalResults(1);
                    setMaxPage(1);
                }
                setIsLoading(false);
                setLoadingWidgets(false);
                setLoadingFilters(false);
            }
        } catch (error) {
            setLoadingFilters(false);
            if (axios.isCancel(error)) {
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setLoadingWidgets(false);
            }
        }
    };

    const getCampaingName = () => {
        try {
            JelouApiV1.get(`/campaigns/${campaignIdUrl}`)
                .then(({ data: res }) => {
                    const { data } = res;
                    setCampaignInfo({
                        name: get(data, "name", ""),
                        status: get(data, "status", ""),
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
    };

    // const addCampaignName = (rows) => {
    //     return rows.map((row) => {
    //         if (row.campaignId === null) return row;
    //         const campaignName = row.campaign.find((campaign) => campaign._id === row.campaignId);
    //         return { ...row, campaignName: get(campaignName, "name") };
    //     });
    // };

    const handleCloseDate = (ev) => {
        setIsOpenDate(ev);
    };
    //Filters

    // const onChangeBot = (bot) => {
    //     setFilterOptions({ ...filterOptions, bot });
    //     setBotId(bot);
    // };

    // const clearFilterBot = () => {
    //     setFilterOptions({ ...filterOptions, bot: [] });
    //     // setBotId(null);
    // };

    const onChange = (status) => {
        if (status !== -1) {
            setStatus(status);
            setFilterOptions({ ...filterOptions, status: status });
        }
    };

    const onChangeOrigin = (origin) => {
        setOrigin(origin);
        setFilterOptions({ ...filterOptions, origin });
    };

    const clearFilterOrigin = () => {
        setFilterOptions({ ...filterOptions, origin: { id: -1 } });
        setOrigin(originArray[0]);
    };

    const onChangeTemplate = (template) => {
        setTemplate(template);
        setFilterOptions({ ...filterOptions, template });
    };

    const onCampaignChange = (campaign) => {
        setSelectedCampaign(campaign);
        setFilterOptions({ ...filterOptions, campaign });
    };

    const onChangeDate = (dates) => {
        const [start, end] = dates;
        setInitialDate(start);
        setFinalDate(end);
        setFilterOptions({ ...filterOptions, date: [start, end] });
        setIsOpenDate(false);
    };

    const onChangeDestination = (evt) => {
        setDestination(evt);
        setFilterOptions({ ...filterOptions, destination: evt });
    };

    // const getElementByBot = async (botId) => {
    //     try {
    //         if (!isEmpty(botId)) {
    //             const { data } = await JelouApiV1.get(`/whatsapp/${botId.id}/hsm`);

    //             const template = data.map((element) => ({
    //                 ...element,
    //                 name: element.elementName,
    //                 id: uuid(),
    //             }));
    //             setTemplateArray([ALL_ELEMENTS, ...template]);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const downloadReport = async () => {
        try {
            if (!isEmpty(botUrl)) {
                setLoadingButton(true);

                // const bot = get(filterOptions, "bot", []);
                const date = get(filterOptions, "date", []);
                const status = get(filterOptions, "status", []);
                const template = get(filterOptions, "template", []);
                // const campaign = get(filterOptions, "campaign", []);
                const destination = get(filterOptions, "destination", []);
                let startAt, endAt;
                //bot: [], date: [], status: [], template: [], campaign: [], destination: []
                if (!isEmpty(date)) {
                    [startAt, endAt] = date;
                    startAt = dayjs(startAt).format();
                    endAt = dayjs(endAt).endOf("day").format();
                }
                const { data } = await JelouApiV1.get(`/bots/${botUrl}/notifications`, {
                    params: {
                        limit: row + 1,
                        ...(!isEmpty(status) && status.id === -1 ? {} : { status: status.label }),
                        ...(!isEmpty(destination) ? { destination } : {}),
                        ...(!isEmpty(template) && template.id === -1 ? {} : { elementName: template.elementName }),
                        ...(!isEmpty(campaignIdUrl) ? { campaignId: campaignIdUrl } : {}),
                        ...(!isEmpty(origin) && origin.id === -1 ? {} : { origin: origin.label }),
                        from: startAt,
                        to: endAt,
                        page: pageLimit,
                        download: true,
                    },
                    responseType: "blob",
                });
                setLoadingButton(false);
                FileDownload(data, `hsm_report_${dayjs().format("DD/MM/YYYY")}.xls`);
            }
        } catch (error) {
            setLoadingButton(false);
            notifyError(t("HSMTableFilter.Error al descargar el reporte"));
            console.log(error);
        }
    };

    const notifyError = (error) => {
        toast.error(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <div className="text-15 text-red-600">{error}</div>
                </div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    };

    const clearDate = () => {
        setFilterOptions({ ...filterOptions, date: [] });
        setInitialDate(null);
        setFinalDate(null);
    };

    const clearFilterStatus = () => {
        setFilterOptions({ ...filterOptions, status: [] });
        setStatus(statusArray[0]);
    };

    const clearFilterTemplate = () => {
        setFilterOptions({ ...filterOptions, template: ALL_ELEMENTS });
        setTemplate(ALL_ELEMENTS);
    };

    const clearFilterCampaign = () => {
        setFilterOptions({ ...filterOptions, campaign: ALL_ELEMENTS });
        setSelectedCampaign(ALL_ELEMENTS);
    };

    const clearAllFilters = () => {
        setFilterOptions(initialFiltersReports);
        setData([]);
        setInitialDate(null);
        setFinalDate(null);
        setDestination("");
        setStatus(statusArray[0]);
        setOrigin(originArray[0]);
        setTemplate(ALL_ELEMENTS);
        setSelectedCampaign(ALL_ELEMENTS);
    };

    return (
        allowedPermission && (
            <div className="overflow-x-hidden overflow-y-hidden bg-white pb-9 pt-5">
                <div className="mx-auto flex flex-col pb-6">
                    {loadingFilters ? (
                        <SkeletonTheme color="#e7f6f8" highlightColor="#F2F7FD">
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <Skeleton height={"2.5rem"} />
                                </div>
                                <div className="w-full">
                                    <Skeleton height={"2.5rem"} />
                                </div>
                                <div className="w-full">
                                    <Skeleton height={"2.5rem"} />
                                </div>
                                <div className="w-full">
                                    <Skeleton height={"2.5rem"} />
                                </div>
                                <div className="w-full">
                                    <Skeleton height={"2.5rem"} />
                                </div>
                            </div>
                        </SkeletonTheme>
                    ) : (
                        <Filters
                            isSpecificCampaign={!isEmpty(campaignId)}
                            botOptions={bots}
                            statusArray={statusArray}
                            onChange={onChange}
                            onChangeDate={onChangeDate}
                            isLoading={isLoading}
                            // onChangeBot={onChangeBot}
                            initialDate={initialDate}
                            finalDate={finalDate}
                            status={status}
                            origin={origin}
                            // botId={botId}
                            onChangeDestination={onChangeDestination}
                            downloadReport={downloadReport}
                            available={available}
                            loadingButton={loadingButton}
                            template={template}
                            templateArray={templateArray}
                            onChangeTemplate={onChangeTemplate}
                            campaigns={campaigns}
                            selectedCampaign={selectedCampaign}
                            onCampaignChange={onCampaignChange}
                            // clearFilterBot={clearFilterBot}
                            isOpenDate={isOpenDate}
                            setOpenDate={handleCloseDate}
                            clearDate={clearDate}
                            filterOptions={filterOptions}
                            clearFilterStatus={clearFilterStatus}
                            clearFilterTemplate={clearFilterTemplate}
                            clearFilterCampaign={clearFilterCampaign}
                            clearAllFilters={clearAllFilters}
                            destination={destination}
                            originArray={originArray}
                            onChangeOrigin={onChangeOrigin}
                            clearFilterOrigin={clearFilterOrigin}
                            campaignInfo={campaignInfo}
                        />
                    )}
                </div>
                <div className="flex flex-col space-y-3 px-7">
                    <Stats metadata={metadata} loadingWidgets={loadingWidgets} />
                    <div className="flex max-h-client flex-1 flex-col rounded-xl border-1 border-gray-100 border-opacity-25">
                        <HsmTable
                            data={data}
                            totalResults={totalResults}
                            pageLimit={pageLimit}
                            setPageLimit={setPageLimit}
                            row={row}
                            setRows={setRows}
                            maxPage={maxPage}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
                <ToastContainer />
            </div>
        )
    );
};

export default DiffusionHsmReports;
