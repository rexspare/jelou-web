import Tippy from "@tippyjs/react";
import dayjs from "dayjs";
import FileDownload from "js-file-download";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader, ClipLoader } from "react-spinners";
import { v4 as uuid } from "uuid";

import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import orderBy from "lodash/orderBy";
import toLower from "lodash/toLower";

import { CampaignsTable } from "@apps/diffusion/ui-shared";
import { setFiltersHsm } from "@apps/redux/store";
import { ComboboxSelect, DateRangePicker, TextFilter } from "@apps/shared/common";
import { CalendarIcon1, Clean, DownloadIcon, RefreshIcon } from "@apps/shared/icons";
import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import CampaignPreview from "./campaign-preview/campaign-preview";

const CampaignsMonitoring = (props) => {
    const { templatePermissionArr, bots, bot: initialBot } = props;
    const dispatch = useDispatch();
    const reduxFilters = useSelector((state) => state.filtersHsm);
    const [teams, setTeams] = useState([]);
    const [bot, setBot] = useState(useSelector((state) => state.filtersHsm.bot));
    const [status, setStatus] = useState(useSelector((state) => state.filtersHsm.status));
    const [types, setTypes] = useState({});
    /* Table stuffs */
    const [data, setData] = useState([]);
    const [totalResults, setTotalResults] = useState("--");
    const [pageLimit, setPageLimit] = useState(1);
    const [row, setRows] = useState(20);
    const [maxPage, setMaxPage] = useState(null);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [selectedHsm, setSelectedHsm] = useState({});
    const [template, setTemplate] = useState({});
    const [campaignToPreview, setCampaignToPreview] = useState({});

    const { t } = useTranslation();

    const [templateName, setTemplateName] = useState(useSelector((state) => state.filtersHsm.name));
    const [isLoading, setIsLoading] = useState(false);
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [loadingHsm, setLoadingHsm] = useState(false);
    const company = useSelector((state) => state.company);
    const [selectedOptions, setSelectedOptions] = useState({});

    const selectedDate = get(reduxFilters, "date", [new Date(dayjs().startOf("month")), new Date(dayjs().endOf("day"))]);
    const [range, setRange] = useState(selectedDate);

    const templateSelected = useSelector((state) => state.filtersHsm.template);
    const [templateItem, setTemplateItem] = useState(isEmpty(templateSelected) ? {} : templateSelected);
    const [configurations, setConfigurations] = useState([]);
    const [flows, setFlows] = useState([]);

    const [templateArray, setTemplateArray] = useState([]);

    const templateStatus = [
        { id: "COMPLETED", name: t(`hsm.${toLower("COMPLETED")}`) },
        { id: "SCHEDULED", name: t(`hsm.${toLower("SCHEDULED")}`) },
        // { id: "PENDING", name: t(`hsm.${toLower("PENDING")}`) }, //pending its when its alredy the time to send the campaign but there are others campaigns been sent at the same time
        { id: "CANCELLED", name: t(`hsm.${toLower("CANCELLED")}`) },
        { id: "IN_PROGRESS", name: t(`hsm.IN_PROGRESS`) },
    ];

    const handleSelect = (bot) => {
        setBot(bot);
        dispatch(setFiltersHsm({ ...reduxFilters, bot }));
    };
    const handleStatus = (statusObj) => {
        setStatus(statusObj);
        dispatch(setFiltersHsm({ ...reduxFilters, status: statusObj }));
    };

    useEffect(() => {
        if (!isEmpty(bots) && isEmpty(bot)) {
            setBot(initialBot);
        }
    }, [bots, bot]);

    useEffect(() => {
        if (!isEmpty(get(reduxFilters, "status", {}))) {
            setStatus(get(reduxFilters, "status", {}));
        }
        if (!isEmpty(get(reduxFilters, "bot", {}))) {
            setBot(get(reduxFilters, "bot", {}));
        }
        if (!isEmpty(get(reduxFilters, "template", {}))) {
            setTemplateItem(get(reduxFilters, "template", {}));
        }
        if (isEmpty(teams)) {
            loadTeams();
        }
    }, []);

    useEffect(() => {
        if (!isEmpty(bot)) {
            getElementByBot(bot);
            getConfigurations();
            getFlows();
        }
    }, [bot]);

    const getConfigurations = async () => {
        try {
            const { data } = await JelouApiV1.get(`/bots/${bot.id}/campaigns/configurations`, {
                params: {
                    shouldPaginate: false,
                },
            });
            if (!isEmpty(data)) {
                let settings = get(data, "data.results").filter((setting) => setting.state);
                setConfigurations(settings);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const getFlows = async () => {
        try {
            const { data } = await JelouApiV1.get(`/bots/${bot.id}/flows`, {
                params: {
                    shouldPaginate: false,
                },
            });
            if (!isEmpty(data)) {
                let newFlow = [];
                let orderFlow = get(data, "results").filter((flow) => flow.status === 1);
                orderFlow.map((op) => newFlow.push({ ...op, name: op.title }));
                setFlows(newFlow);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCampaigns();
    }, [bot, templateName, row, pageLimit, range, templateItem, status, types]);

    useEffect(() => {
        setPageLimit(1);
    }, [bot, templateName, status, types]);

    const renderBeatLoader = () => {
        return (
            <div className="ml-2 flex h-6 w-12 flex-row">
                <BeatLoader size={"0.5rem"} color="#00B3C7" />
            </div>
        );
    };

    const loadTeams = async () => {
        try {
            const companyId = get(company, "id");
            const { data } = await DashboardServer.get(`/companies/${companyId}/teams`);
            const results = get(data, "data", []);
            let teamArray = [{ id: -1, value: -1, name: "Todos" }];
            results.forEach((team) => {
                teamArray.push({ id: team.id, name: team.name });
            });
            setTeams(teamArray);
        } catch (error) {
            console.log(error);
        }
    };

    const downloadTemplates = async () => {
        try {
            setLoadingDownload(true);
            const { data } = await JelouApiV1.get(`/campaigns`, {
                params: {
                    shouldPaginate: false,
                    download: true,
                    ...(status ? { status: status.id } : {}),
                    ...(types ? { type: types.id } : {}),
                    ...(bot ? { botId: bot.id } : {}),
                    ...(range !== [] ? { startAt: range[0], endAt: range[1] } : {}),
                    ...(!isEmpty(templateName) ? { name: templateName.trim() } : {}),
                    ...(!isEmpty(templateItem) ? { elementName: templateItem.name.trim() } : {}),
                },
                responseType: "blob",
            });
            setLoadingDownload(false);
            FileDownload(data, `campaigns_report_${dayjs().format("DD/MM/YYYY")}.xls`);
        } catch (error) {
            console.log(error);
        }
    };

    const getCampaigns = async (refreshTable = false) => {
        try {
            if (refreshTable) {
                setLoadingRefresh(true);
            }
            if (!isEmpty(bot)) {
                setIsLoading(true);
                const { data } = await JelouApiV1.get(`/campaigns`, {
                    params: {
                        page: pageLimit,
                        limit: row,
                        ...(status ? { status: status.id } : {}),
                        ...(types ? { type: types.id } : {}),
                        ...(bot ? { botId: bot.id } : {}),
                        ...(range !== [] ? { startAt: range[0], endAt: range[1] } : {}),
                        ...(!isEmpty(templateName) ? { name: templateName.trim() } : {}),
                        ...(!isEmpty(templateItem) ? { elementName: templateItem.name.trim() } : {}),
                    },
                });

                if (!isEmpty(data.results)) {
                    const { results = [], pagination } = data;

                    results.forEach((param) => {
                        if (!isEmpty(param.params)) {
                            param.params.forEach((par) => {
                                const id = uuid();
                                par.id = id;
                            });
                        }
                    });
                    setData(
                        results.sort((a, b) => {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        })
                    );
                    setTotalResults(pagination.total);
                    setMaxPage(pagination.totalPages);
                    setLoadingRefresh(false);
                } else {
                    setData([]);
                    setLoadingRefresh(false);
                }
                setIsLoading(false);
                setLoadingRefresh(false);
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    function handleUpdate(id, param, value) {
        const updatedCampaign = data.map((campaignObj) => {
            if (campaignObj._id === id) {
                param.forEach((paramObj, index) => {
                    campaignObj[paramObj] = value[index];
                });
            }
            return campaignObj;
        });
        setData(updatedCampaign);
    }

    const onChangeTemplateFilter = (templateObj) => {
        setTemplateItem(templateObj);
        setSelectedOptions({ ...selectedOptions, template: templateObj });
        dispatch(setFiltersHsm({ ...reduxFilters, template: templateObj }));
    };

    const onChangeTemplateName = (evt) => {
        setTemplateName(evt);
        dispatch(setFiltersHsm({ ...reduxFilters, name: evt }));
    };

    const clearFilterTemplate = () => {
        setSelectedOptions({ ...selectedOptions, template: {} });
        setTemplateItem({});
        dispatch(setFiltersHsm({ ...reduxFilters, template: {} }));
    };

    const dateChange = (range) => {
        let [startDate, endDate] = range;
        setRange([startDate, endDate]);
        dispatch(setFiltersHsm({ ...reduxFilters, date: range }));
    };

    const getElementByBot = async () => {
        try {
            if (!isEmpty(bot)) {
                const { data } = await JelouApiV1.get(`/whatsapp/${bot.id}/hsm`, {
                    params: {
                        status: "APPROVED",
                    },
                });

                const template = data.map((element) => ({
                    ...element,
                    name: element.elementName,
                    id: uuid(),
                }));
                setTemplateArray(orderBy(template, ["name"], ["asc"]));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const clearDate = () => {
        setRange([new Date(dayjs().startOf("month")), new Date(dayjs().endOf("day"))]);
        dispatch(setFiltersHsm({ ...reduxFilters, date: [new Date(dayjs().startOf("month")), new Date(dayjs().endOf("day"))] }));
    };

    const clearAllFilters = () => {
        clearDate();
        clearFilter("status");
        setTemplateName("");
        setTemplateItem({});
        dispatch(
            setFiltersHsm({
                ...reduxFilters,
                status: {},
                date: [new Date(dayjs().startOf("month")), new Date(dayjs().endOf("day"))],
                name: "",
                template: {},
            })
        );
    };

    const getHSM = async (bot, elementName) => {
        try {
            setLoadingHsm(true);
            if (!isEmpty(bot)) {
                const { data } = await JelouApiV1.get(`/bots/${bot}/templates`, {
                    params: {
                        page: 1,
                        limit: 20,
                        query: elementName,
                    },
                });
                const { results } = data;
                if (!isEmpty(results)) {
                    const actualHsm = first(results);
                    setSelectedHsm(actualHsm);
                }

                setLoadingHsm(false);
            }
            setLoadingHsm(false);
        } catch (error) {
            setLoadingHsm(false);
            console.log("error ==> ", error);
        }
    };

    const openViewCampaign = async (campaignElement) => {
        setShowCampaignModal(true);
        setLoadingHsm(true);
        const { data: res } = await JelouApiV1.get(`/campaigns/${campaignElement._id}`);
        const { data } = res;
        setCampaignToPreview(merge(campaignElement, data));
        if (data) {
            getHSM(campaignElement.botId, get(campaignElement, "metadata.elementName"));
            const templateResponse = data;
            setTemplate(templateResponse);
        } else {
            setLoadingHsm(false);
        }
    };

    const clearFilter = (name) => {
        if (name === "status") {
            setStatus({});
            dispatch(setFiltersHsm({ ...reduxFilters, status: {} }));
        }
        if (name === "type") {
            setTypes({});
        }
    };

    const refreshTable = () => {
        getCampaigns(true);
    };

    if (templatePermissionArr.find((permission) => permission === "hsm:view_template")) {
        return (
            <div className="overflow-y-visible">
                <div className="flex w-full flex-col items-center justify-between px-2 lg:flex-row">
                    <div className="flex flex-1 space-x-6 p-2 py-4">
                        <div className="inline-flex w-2/12">
                            <TextFilter
                                name="templateName"
                                value={templateName}
                                filter={"number"}
                                onChange={onChangeTemplateName}
                                label={t("Buscar en campaña")}
                            />
                        </div>
                        {bots.length > 1 && (
                            <div className="inline-flex w-2/12">
                                <label htmlFor="name" className="w-full">
                                    <ComboboxSelect
                                        options={bots}
                                        value={bot}
                                        placeholder={"Bot"}
                                        label={"Bot"}
                                        handleChange={handleSelect}
                                        name={"bot"}
                                        background={"#fff"}
                                        hasCleanFilter={false}
                                    />
                                </label>
                            </div>
                        )}
                        <div className="inline-flex w-2/12">
                            <label htmlFor="name" className="w-full">
                                <ComboboxSelect
                                    options={templateStatus.sort((a, b) => a.name.localeCompare(b.name))}
                                    value={status}
                                    placeholder={t("hsm.status")}
                                    label={t("hsm.status")}
                                    handleChange={handleStatus}
                                    name={"status"}
                                    background={"#fff"}
                                    hasCleanFilter={true}
                                    clearFilter={clearFilter}
                                />
                            </label>
                        </div>

                        <div className="inline-flex w-48">
                            <ComboboxSelect
                                options={templateArray}
                                value={templateItem}
                                placeholder={t("HSMTableFilter.selecttemplate")}
                                label={t("HSMTableFilter.selecttemplate")}
                                handleChange={onChangeTemplateFilter}
                                name={"template"}
                                background={"#fff"}
                                clearFilter={clearFilterTemplate}
                            />
                        </div>

                        <div className="xl:w-2/2 inline-flex h-full w-2/12">
                            <DateRangePicker right dateValue={range} icon={CalendarIcon1} dateChange={dateChange} clearDate={clearDate} />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pl-4">
                        <Tippy content={t("hsm.refresh")} theme={"jelou"} placement={"bottom"}>
                            <button
                                disabled={loadingRefresh}
                                className="flex h-[1.90rem] w-[1.90rem] items-center justify-center rounded-full bg-gray-20 focus:outline-none"
                                onClick={() => {
                                    refreshTable();
                                }}>
                                <RefreshIcon
                                    width="1.25rem"
                                    height="1.25rem"
                                    fill="currentColor"
                                    className={`text-gray-425  ${loadingRefresh ? "animate-spinother" : ""}`}
                                />
                            </button>
                        </Tippy>
                        <Tippy content={t("clients.clean")} theme={"jelou"} placement={"bottom"}>
                            <button
                                className="flex h-[1.90rem] w-[1.90rem] items-center justify-center rounded-full bg-green-960 focus:outline-none"
                                onClick={() => clearAllFilters()}>
                                <Clean className="fill-current text-white" width="1.188rem" height="1.188rem" />
                            </button>
                        </Tippy>
                        <Tippy content={t("clients.download")} theme={"jelou"} placement={"bottom"} touch={false}>
                            <button
                                className="color-gradient flex h-[1.90rem] w-[1.96rem] items-center justify-center rounded-full focus:outline-none"
                                onClick={downloadTemplates}>
                                {loadingDownload ? (
                                    <ClipLoader color={"white"} size="1.1875rem" />
                                ) : (
                                    <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />
                                )}
                            </button>
                        </Tippy>
                    </div>
                </div>
                <div className="flex max-h-view flex-1 flex-col overflow-hidden">
                    <CampaignsTable
                        data={data}
                        totalResults={totalResults}
                        pageLimit={pageLimit}
                        setPageLimit={setPageLimit}
                        row={row}
                        bot={bot}
                        setRows={setRows}
                        maxPage={maxPage}
                        isLoading={isLoading}
                        openViewCampaign={openViewCampaign}
                        handleUpdate={handleUpdate}
                    />
                </div>
                <CampaignPreview
                    campaignToPreview={campaignToPreview}
                    isOpen={showCampaignModal}
                    onClose={() => {
                        setSelectedHsm(null);
                        setTemplate(null);
                        setShowCampaignModal(false);
                    }}
                    template={template}
                    renderBeatLoader={renderBeatLoader}
                    selectedHsm={selectedHsm}
                    loadingHsm={loadingHsm}
                    configurations={configurations}
                    flows={flows}
                />
            </div>
        );
    } else return <div></div>;
};

export default CampaignsMonitoring;
