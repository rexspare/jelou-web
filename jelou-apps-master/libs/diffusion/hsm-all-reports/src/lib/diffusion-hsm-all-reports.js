import axios from "axios";
import FileDownload from "js-file-download";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { v4 as uuid } from "uuid";

import { Stats } from "@apps/diffusion/ui-shared";
import { JelouApiV1 } from "@apps/shared/modules";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import Filters from "./Components/Filters";
import HsmTable from "./Components/HsmTable";

const DiffusionHsmReports = (props) => {
    const { allowedPermission, bots } = props;
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
    const [botId, setBotId] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState({});
    const [loadingFilters, setLoadingFilters] = useState(true);

    const initialFiltersReports = {
        bot: [],
        date: [],
        status: [],
        template: [],
        campaign: [],
        destination: [],
    };

    const [filterOptions, setFilterOptions] = useState({
        ...initialFiltersReports,
        date: [new Date(dayjs().startOf("day")), new Date(dayjs().endOf("day"))],
    });

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
    const [origin, setOrigin] = useState(ALL_ELEMENTS);
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
        {
            id: 3,
            label: "CREATED",
            name: t("HSMTable.created"),
            value: 3,
        },
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
        {
            id: 3,
            label: "OPERATOR_VIEW",
            name: t("HSMTable.OPERATOR_VIEW"),
            value: 2,
        },
    ];

    useEffect(() => {
        if (!isEmpty(filterOptions.bot)) {
            getElementByBot(filterOptions.bot);
        }
    }, [filterOptions.bot]);

    useEffect(() => {
        if (!isEmpty(bots)) {
            setLoadingFilters(false);
            setBotId(first(bots));
            setFilterOptions({ ...filterOptions, bot: first(bots) });
        }
    }, [bots]);

    useEffect(() => {
        setPageLimit(1);
        setRows(20);
    }, [filterOptions]);

    useEffect(() => {
        searchReportGeneralData();
    }, [row, pageLimit]);

    useEffect(() => {
        if (filterOptions !== initialFiltersReports) {
            searchReportGeneralData();
        } else {
            setData([]);
        }
    }, [filterOptions]);

    const searchReportGeneralData = async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Operation canceled due to new request.");
        }
        try {
            const bot = get(filterOptions, "bot", []);
            if (!isEmpty(bot)) {
                setIsLoading(true);
                setButtonAvailable(true);
                setLoadingWidgets(true);
                const source = axios.CancelToken.source();
                setCancelToken(source);

                const date = get(filterOptions, "date", []);
                const status = get(filterOptions, "status", []);
                const template = get(filterOptions, "template", []);
                const campaign = get(filterOptions, "campaign", []);
                const destination = get(filterOptions, "destination", []);
                const origin = get(filterOptions, "origin", { id: -1 });

                let startAt, endAt;
                //bot: [], date: [], status: [], template: [], campaign: [], destination: []
                if (!isEmpty(date)) {
                    [startAt, endAt] = date;
                    startAt = dayjs(startAt).format();
                    endAt = dayjs(endAt).endOf("day").format();
                }
                const { data } = await JelouApiV1.get(`/bots/${bot.id}/notifications`, {
                    params: {
                        limit: row,
                        ...(!isEmpty(status) && status.id === -1 ? {} : { status: status.label }),
                        ...(!isEmpty(destination) ? { destination } : {}),
                        ...(!isEmpty(template) && template.id === -1 ? {} : { elementName: template.elementName }),
                        ...(!isEmpty(campaign) ? { campaignId: campaign._id } : {}),
                        ...(!isEmpty(origin) && origin.id === -1 ? {} : { origin: origin.label }),
                        from: startAt,
                        to: endAt,
                        page: pageLimit,
                    },
                    cancelToken: source.token,
                });
                const campaignsList = await getCampaingName(bot.id);
                if (!isEmpty(data.results)) {
                    const parsedData = addCampaignName(data.results, campaignsList);
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
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setLoadingWidgets(false);
            }
        }
    };

    const getCampaingName = (botId) => {
        return JelouApiV1.get(`/bots/${botId}/campaigns`)
            .then(({ data }) => {
                let desc = [...data];
                desc = desc.sort(function (a, b) {
                    return dayjs(b.updatedAt, "DD/MM/YYYY - hh:mm:ss") - dayjs(a.updatedAt, "DD/MM/YYYY / hh:mm:ss");
                });
                const sorted = desc.sort((a, b) => dayjs(b.updatedAt).format() - dayjs(a.updatedAt).format());
                const date = filterOptions.date;
                if (!isEmpty(date)) {
                    const [startAt, endAt] = date;
                    const start = dayjs(startAt).format();
                    const end = dayjs(endAt).endOf("day").format();
                    const campaigns = sorted.filter((campaign) => {
                        return dayjs(campaign.updatedAt).format() >= start && dayjs(campaign.updatedAt).format() <= end;
                    });
                    setCampaigns(campaigns);
                    return campaigns;
                }

                setCampaigns(sorted);
                return data;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const addCampaignName = (rows) => {
        return rows.map((row) => {
            if (row.campaignId === null) return row;
            const campaignName = row.campaign.find((campaign) => campaign._id === row.campaignId);
            return { ...row, campaignName: get(campaignName, "name") };
        });
    };

    const handleCloseDate = (ev) => {
        setIsOpenDate(ev);
    };
    //Filters

    const onChangeBot = (bot) => {
        setFilterOptions({ ...filterOptions, bot });
        setBotId(bot);
    };

    const clearFilterBot = () => {
        setFilterOptions({ ...filterOptions, bot: [] });
        setBotId(null);
    };

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

    const getElementByBot = async (botId) => {
        try {
            if (!isEmpty(botId)) {
                const { data } = await JelouApiV1.get(`/bots/${botId.id}/templates`, {
                    params: {
                        shouldPaginate: false,
                    },
                });
                const template = data?.results?.map((element) => ({
                    ...element,
                    name: element.elementName,
                    id: uuid(),
                }));
                setTemplateArray([ALL_ELEMENTS, ...template]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const downloadReport = async () => {
        try {
            if (!isEmpty(botId)) {
                setLoadingButton(true);

                const bot = get(filterOptions, "bot", []);
                const date = get(filterOptions, "date", []);
                const status = get(filterOptions, "status", []);
                const template = get(filterOptions, "template", []);
                const campaign = get(filterOptions, "campaign", []);
                const destination = get(filterOptions, "destination", []);
                let startAt, endAt;
                //bot: [], date: [], status: [], template: [], campaign: [], destination: []
                if (!isEmpty(date)) {
                    [startAt, endAt] = date;
                    startAt = dayjs(startAt).format();
                    endAt = dayjs(endAt).endOf("day").format();
                }
                const { data } = await JelouApiV1.get(`/bots/${bot.id}/notifications`, {
                    params: {
                        limit: row + 1,
                        ...(!isEmpty(status) && status.id === -1 ? {} : { status: status.label }),
                        ...(!isEmpty(destination) ? { destination } : {}),
                        ...(!isEmpty(template) && template.id === -1 ? {} : { elementName: template.elementName }),
                        ...(!isEmpty(campaign) ? { campaignId: campaign._id } : {}),
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
            <div className="overflow-x-hidden overflow-y-hidden bg-white py-9">
                <div className="mx-auto flex flex-col px-7 pb-6 lg:px-7">
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
                            botOptions={bots}
                            statusArray={statusArray}
                            onChange={onChange}
                            onChangeDate={onChangeDate}
                            onChangeBot={onChangeBot}
                            initialDate={initialDate}
                            finalDate={finalDate}
                            status={status}
                            origin={origin}
                            botId={botId}
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
                            clearFilterBot={clearFilterBot}
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
                        />
                    )}
                    <Stats metadata={metadata} loadingWidgets={loadingWidgets} />
                </div>
                <div className="mx-7 flex max-h-client flex-1 flex-col rounded-xl border-1 border-gray-100 border-opacity-25">
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
                <ToastContainer />
            </div>
        )
    );
};

export default DiffusionHsmReports;
