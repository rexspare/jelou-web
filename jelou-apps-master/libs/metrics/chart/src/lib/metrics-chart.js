import es from "date-fns/locale/es";
// import FileDownload from "js-file-download";
import first from "lodash/first";
import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import some from "lodash/some";
import toUpper from "lodash/toUpper";
import React, { useContext, useEffect, useState } from "react";
import { registerLocale } from "react-datepicker";
import FullScreenChartContainer from "./components/FullScreenChartContainer";

import { DateContext } from "@apps/context";
import { MetricServer } from "@apps/shared/modules";
import axios from "axios";
import { useSelector } from "react-redux";
import BarChart from "./components/BarChart";
import BarLineChart from "./components/BarLineChart";
import ChartContainer from "./components/ChartContainer";
import ErrorBoundary from "./components/ErrorBoundary";
import HorizontalBarChart from "./components/HorizontalBarChart";
import LineChart from "./components/LineChart";
import MultilineChart from "./components/MultiLineChart";
import NodeChart from "./components/NodeChart";
import NumberChart from "./components/NumberChart";
import PieChart from "./components/PieChart";
import StackedBarChart from "./components/StackedBarChart";
import TableChart from "./components/TableChart";
import PERIODS from "./constants";
registerLocale("es", es);

const ALL = { id: -1, value: -1, name: "Todos" };

const MetricsChart = (props) => {
    const { invocationName, chartProperties = {}, id, bots, companies, schemaPayload, type, description, translationsTitles, hasCustomFilters, showPercentage } = props;
    const dayjs = useContext(DateContext);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const constPeriods = PERIODS();
    const [period, setPeriod] = useState(constPeriods.find((e) => e.value === get(chartProperties, "defaultPeriod", "currentMonth")));
    const [startAt, setStartAt] = useState(null);
    const [endAt, setEndAt] = useState(null);
    const [chart, setChart] = useState(null);
    const [bot, setBot] = useState({});
    const [companySelect, setCompanySelect] = useState(null);
    const [fullscreen, setFullScreen] = useState(false);
    const [tagsChecked, setTagsChecked] = useState(false);
    const [multipleBot, setMultipleBot] = useState([]);
    const [cancelToken, setCancelToken] = useState();
    const [cancelTokenInvokeFilters, setCancelTokenInvokeFilters] = useState();

    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const hasFilterByType = has(schemaPayload, "properties.botId.filterByType");
    const filterByType = get(schemaPayload, "properties.botId.filterByType");
    const requiresBot = has(schemaPayload, "properties.botId");
    const hasAllBot = has(schemaPayload, "properties.botId.hasAllBot");
    const hasBotId = has(schemaPayload, "properties.botId.id");
    const [filterBots, setFilteredBots] = useState([]);
    const [botsOptions, setBotsOptions] = useState([]);
    const [botsOptionsAll, setBotsOptionsAll] = useState([]);
    const [customFilters, setCustomFilters] = useState([]);
    const [selectedCustom, setSelectedCustom] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loadCustomFilters, setLoadCustomFilters] = useState(hasCustomFilters);

    useEffect(() => {
        if (hasBotId) {
            const filteredBots = bots.filter((bot) => get(schemaPayload, "properties.botId.id").includes(bot.id));
            setBotsOptions(filteredBots.map((bot) => ({ id: bot.id, name: `${bot.name}`, value: bot.id })));
            setBot(filteredBots[0]);
        } else if (hasFilterByType) {
            const filterBots = bots.filter((bot) => toUpper(bot.type) === toUpper(filterByType));
            setBotsOptions(filterBots.map((bot) => ({ id: bot.id, name: `${bot.name}`, value: bot.id })));
            setBot(filterBots[0]);
        } else {
            setBotsOptions(bots.map((bot) => ({ id: bot.id, name: `${bot.name}`, value: bot.id })));
        }
    }, [bots, hasFilterByType, hasBotId]);

    useEffect(() => {
        if (botsOptions.length > 1 && hasAllBot) {
            setBotsOptionsAll([ALL, ...botsOptions]);
        } else {
            setBotsOptionsAll(botsOptions);
        }
        if (!isEmpty(botsOptions)) {
            setBot(first(botsOptions));
            setMultipleBot([first(botsOptions)]);
        }
    }, [hasAllBot, botsOptions]);

    useEffect(() => {
        if (hasFilterByType) {
            setFilteredBots(bots.filter((bot) => toUpper(bot.type) === toUpper(filterByType)));
        }
    }, [hasFilterByType]);

    function getChartToRender(isFullScreen = false) {
        if (!isEmpty(errors)) return <ErrorBoundary chartProperties={chartProperties} invokeMetric={invokeMetric}></ErrorBoundary>;
        switch (toUpper(type)) {
            case "LINE":
                return (
                    <LineChart
                        {...props}
                        chart={chart}
                        setChart={setChart}
                        data={data}
                        fullscreen={fullscreen}
                        tagsChecked={tagsChecked}
                        isFullScreen={isFullScreen}
                        translationsTitles={translationsTitles}
                    />
                );
            case "PIE":
                return (
                    <PieChart
                        {...props}
                        chart={chart}
                        setChart={setChart}
                        data={data}
                        fullscreen={fullscreen}
                        tagsChecked={tagsChecked}
                        isFullScreen={isFullScreen}
                        translationsTitles={translationsTitles}
                        showPercentage={showPercentage}
                    />
                );
            case "BAR":
            case "GROUPEDBAR":
                return (
                    <BarChart
                        {...props}
                        chart={chart}
                        setChart={setChart}
                        data={data}
                        fullscreen={fullscreen}
                        tagsChecked={tagsChecked}
                        isFullScreen={isFullScreen}
                        translationsTitles={translationsTitles}
                        chartProperties={chartProperties}
                    />
                );
            case "HORIZONTALBAR":
                return (
                    <HorizontalBarChart
                        {...props}
                        chart={chart}
                        setChart={setChart}
                        data={data}
                        fullscreen={fullscreen}
                        tagsChecked={tagsChecked}
                        isFullScreen={isFullScreen}
                        translationsTitles={translationsTitles}
                    />
                );
            case "STACKEDBAR":
                return (
                    <StackedBarChart
                        {...props}
                        chart={chart}
                        setChart={setChart}
                        data={data}
                        fullscreen={fullscreen}
                        tagsChecked={tagsChecked}
                        isFullScreen={isFullScreen}
                        translationsTitles={translationsTitles}
                    />
                );
            case "NUMBER":
                return <NumberChart {...props} period={period} data={data} fullscreen={fullscreen} />;
            case "TABLE":
                return <TableChart {...props} period={period} data={data} />;
            case "BARLINE":
                return (
                    <BarLineChart
                        {...props}
                        chart={chart}
                        setChart={setChart}
                        data={data}
                        fullscreen={fullscreen}
                        tagsChecked={tagsChecked}
                        isFullScreen={isFullScreen}
                        translationsTitles={translationsTitles}
                    />
                );
            case "MULTILINES":
                return (
                    <MultilineChart
                        {...props}
                        chart={chart}
                        setChart={setChart}
                        data={data}
                        fullscreen={fullscreen}
                        tagsChecked={tagsChecked}
                        isFullScreen={isFullScreen}
                        translationsTitles={translationsTitles}
                    />
                );
            case "NODES":
                return <NodeChart {...props} data={data} fullscreen={fullscreen} isFullScreen={isFullScreen} translationsTitles={translationsTitles} />;
            default:
                break;
        }
    }

    useEffect(() => {
        if (isEmpty(companies) && !isEmpty(company)) {
            setCompanySelect(company);
        } else {
            setCompanySelect(first(companies));
        }
    }, [company]);

    useEffect(() => {
        invokeMetric();
        if (loadCustomFilters && !isEmpty(companySelect)) {
            invokeFilters();
        }
    }, [userSession, startAt, endAt, bot, company, multipleBot, companySelect, hasCustomFilters, selectedCustom]);

    useEffect(() => {
        setBot(first(bots));
    }, [bots]);

    useEffect(() => {
        setLoading(true);
        switch (period.value) {
            case "today":
                setToday();
                break;
            case "currentWeek":
                setCurrentWeek();
                break;
            case "currentMonth":
                setCurrentMonth();
                break;
            case "currentYear":
                setCurrentYear();
                break;
            default:
                break;
        }
    }, [period]);

    function setToday() {
        setStartAt(dayjs().startOf("day"));
        setEndAt(dayjs().endOf("day"));
    }

    function setCurrentWeek() {
        setStartAt(dayjs().startOf("week"));
        setEndAt(dayjs().endOf("week"));
    }

    function setCurrentMonth() {
        setStartAt(dayjs().startOf("month"));
        setEndAt(dayjs().endOf("month"));
    }

    function setCurrentYear() {
        setStartAt(dayjs().startOf("year"));
        setEndAt(dayjs().endOf("year"));
    }

    function handleCustomChange(event, name, multiple = false) {
        let _selectedCustom = { ...selectedCustom };
        _selectedCustom[name] = event;
        setSelectedCustom({ ..._selectedCustom });
        const _customFilters = [...customFilters];
        _customFilters.map((filter) => {
            if (filter.keyToSend === name) {
                filter.value = event;
            }
            return filter;
        });
        setCustomFilters([..._customFilters]);
    }

    function clearFilters(keyToSend) {
        if (!isEmpty(selectedCustom)) {
            let _selectedCustom = { ...selectedCustom };
            delete _selectedCustom[keyToSend];
            setSelectedCustom({ ..._selectedCustom });
            const _customFilters = [...customFilters];
            _customFilters.map((filter) => {
                if (filter.keyToSend === keyToSend) {
                    filter.value = {};
                }
                return filter;
            });
            setCustomFilters([..._customFilters]);
        }
    }

    function exportChart() {
        try {
            setLoadingDownload(true);
            const base64 = chart.toBase64Image();
            // FileDownload(base64, "image.png", "image/png");
            setLoadingDownload(false);
            const downloadLink = document.createElement("a");
            downloadLink.href = base64;
            downloadLink.download = "chart.png";
            downloadLink.click();
            window.URL.revokeObjectURL(downloadLink);
        } catch (err) {
            setLoadingDownload(false);
            console.error(err);
        }
    }

    function verifyBot() {
        let botId = [];

        if (requiresBot) {
            if (hasAllBot) {
                if (isEmpty(multipleBot)) {
                    if (hasBotId) {
                        botId = get(schemaPayload, "properties.botId.id");
                    } else if (hasFilterByType) {
                        botId = filterBots.map((bot) => bot.id);
                    } else {
                        botId = bots.map((bot) => bot.id);
                    }
                    return botId;
                }
                if (hasBotId) {
                    if (some(multipleBot, ALL)) {
                        botId = get(schemaPayload, "properties.botId.id");
                    } else {
                        botId = multipleBot.map((bot) => bot.value);
                    }
                    return botId;
                }
                if (hasFilterByType) {
                    if (some(multipleBot, ALL)) {
                        botId = filterBots.map((bot) => bot.id);
                        return botId;
                    }
                    botId = multipleBot.map((bot) => bot.value);
                } else {
                    if (some(multipleBot, ALL)) {
                        botId = bots.map((bot) => bot.id);
                        return botId;
                    }
                    botId = multipleBot.map((bot) => bot.value);
                }
                return botId;
            } else {
                if (isEmpty(bot)) {
                    if (hasBotId) {
                        botId = get(schemaPayload, "properties.botId.id");
                    } else if (hasFilterByType) {
                        botId = filterBots.map((bot) => bot.id);
                    } else {
                        botId = bots.map((bot) => bot.id);
                    }
                    return botId;
                }
                if (hasBotId) {
                    if (isEqual(bot, ALL)) {
                        botId = get(schemaPayload, "properties.botId.id");
                    }
                    botId = bot.id;
                    return botId;
                }
                if (hasFilterByType) {
                    if (isEqual(bot, ALL)) {
                        botId = filterBots.map((bot) => bot.id);
                        return botId;
                    }
                    botId = bot.id;
                } else {
                    if (isEqual(bot, ALL)) {
                        botId = bots.map((bot) => bot.id);
                        return botId;
                    }
                    botId = bot.id;
                }
                return botId;
            }
        }
        return botId;
    }
    async function invokeFilters() {
        if (!isEmpty(cancelTokenInvokeFilters)) {
            await cancelTokenInvokeFilters.cancel(`Operation canceled due to new request. ${invocationName}`);
        }
        try {
            const source = axios.CancelToken.source();
            setCancelTokenInvokeFilters(source);
            const { teamScopes = [] } = userSession;
            const requiresBot = has(schemaPayload, "properties.botId");
            const botId = verifyBot();
            const { data } = await MetricServer.post(
                `${invocationName}`,
                {
                    companyId: companySelect.id,
                    startAt: startAt.startOf("day").format(),
                    endAt: endAt.endOf("day").format(),
                    ...(!isEmpty(teamScopes) ? { teams: teamScopes } : {}),
                    ...(requiresBot && !isEmpty(botId) && { botId }),
                    ...(["currentWeek", "currentMonth", "currentYear", "today"].includes(period.value) ? { period: period.value } : {}),
                    ...(hasCustomFilters && { customFilters: hasCustomFilters }),
                },
                { cancelToken: source.token }
            );
            let _filters = get(data, "data", []);
            const filters = _filters.map((_filter) => {
                const supportAllOptions = _filter?.supportAllOptions;
                let _selector = get(_filter, "selector");
                let selector = _selector.map((option) => ({ ...option, name: get(option, "label") }));
                if (supportAllOptions) {
                    selector.unshift(ALL);
                }
                const filter = { ..._filter, selector, value: {} };
                return filter;
            });
            setCustomFilters(filters);
            setLoadCustomFilters(false);
        } catch (error) {
            setLoadCustomFilters(false);
            console.error(error);
        }
    }

    const handleCustomParams = () => {
        if (!isEmpty(selectedCustom)) {
            let customParams = {};
            const filterKeys = Object.keys(selectedCustom);

            filterKeys.forEach((custom) => {
                const hasSupportAllOptions = customFilters.find((filter) => filter.keyToSend === custom)?.supportAllOptions;
                if (hasSupportAllOptions) {
                    const valueMultiple = selectedCustom[custom];
                    let valueArray = valueMultiple.map((val) => val.value);
                    if (valueArray[0] === -1) {
                        valueArray.shift();
                    }
                    customParams = { ...customParams, [custom]: valueArray };
                } else {
                    const value = selectedCustom[custom]?.value;
                    customParams = { ...customParams, [custom]: value };
                }
            });
            return customParams;
        }
        return {};
    };

    async function invokeMetric() {
        if (!isEmpty(cancelToken)) {
            setLoading(true);
            await cancelToken.cancel(`Operation canceled due to new request. ${invocationName}`);
        }
        try {
            if (!startAt || !endAt) {
                return;
            }
            setLoading(true);
            const source = axios.CancelToken.source();
            setCancelToken(source);
            const { teamScopes = [] } = userSession;
            const requiresBot = has(schemaPayload, "properties.botId");
            const botId = verifyBot();

            let customParams = handleCustomParams();
            const { data } = await MetricServer.post(
                `${invocationName}`,
                {
                    companyId: companySelect.id,
                    startAt: startAt.startOf("day").format(),
                    endAt: endAt.endOf("day").format(),
                    ...(!isEmpty(teamScopes) ? { teams: teamScopes } : {}),
                    ...(requiresBot && !isEmpty(botId) && { botId }),
                    ...(["currentWeek", "currentMonth", "currentYear", "today"].includes(period.value) ? { period: period.value } : {}),
                    ...(!isEmpty(customParams) && customParams),
                },
                { cancelToken: source.token }
            );
            setData(get(data, "data"));
            setLoading(false);
            setErrors([]);
        } catch (error) {
            console.error(error);
            if (get(error, "__CANCEL__")) {
                setErrors(error);
                setLoading(true);
            } else {
                setLoading(false);
                setErrors(error);
            }
        }
    }

    function showLabels(e) {
        e.target.checked = !tagsChecked;
        setTagsChecked(!tagsChecked);
    }

    const onClose = () => {
        setTagsChecked(false);
        setFullScreen(!fullscreen);
    };

    const handleCompany = (id) => {
        setCompanySelect(id);
    };

    return (
        <div>
            <FullScreenChartContainer
                fullscreen={fullscreen}
                setFullScreen={setFullScreen}
                id={`chart-${id}`}
                title={props.title}
                startAt={startAt}
                setStartAt={setStartAt}
                endAt={endAt}
                setEndAt={setEndAt}
                loading={loading}
                loadingDownload={loadingDownload}
                setLoadingDownload={setLoadingDownload}
                period={period}
                setPeriod={setPeriod}
                type={type}
                bots={bots}
                companies={companies}
                bot={bot}
                setBot={setBot}
                companySelect={companySelect}
                setCompanySelect={setCompanySelect}
                schemaPayload={schemaPayload}
                handlePeriodChange={setPeriod}
                exportChart={exportChart}
                description={description}
                getChartToRender={getChartToRender}
                botsOptionsAll={botsOptionsAll}
                invocationName={invocationName}
                multipleBot={multipleBot}
                setMultipleBot={setMultipleBot}
                showLabels={showLabels}
                setTagsChecked={setTagsChecked}
                onClose={onClose}
                handleCompany={handleCompany}
                hasCustomFilters={hasCustomFilters}
                customFilters={customFilters}
                handleCustomChange={handleCustomChange}
                clearFilters={clearFilters}
                invokeMetric={invokeMetric}
                handleCustomParams={handleCustomParams}
            />
            <ChartContainer
                setFullScreen={setFullScreen}
                id={`chart-${id}`}
                title={props.title}
                startAt={startAt}
                setStartAt={setStartAt}
                endAt={endAt}
                setEndAt={setEndAt}
                loading={loading}
                loadingDownload={loadingDownload}
                setLoadingDownload={setLoadingDownload}
                period={period}
                setPeriod={setPeriod}
                type={type}
                bots={bots}
                companies={companies}
                bot={bot}
                setBot={setBot}
                companySelect={companySelect}
                setCompanySelect={setCompanySelect}
                schemaPayload={schemaPayload}
                handlePeriodChange={setPeriod}
                exportChart={exportChart}
                description={description}
                invocationName={invocationName}
                multipleBot={multipleBot}
                setMultipleBot={setMultipleBot}
                botsOptionsAll={botsOptionsAll}
                setTagsChecked={setTagsChecked}
                onClose={onClose}
                handleCompany={handleCompany}
                showLabels={showLabels}
                hasCustomFilters={hasCustomFilters}
                customFilters={customFilters}
                handleCustomChange={handleCustomChange}
                clearFilters={clearFilters}
                invokeMetric={invokeMetric}
                handleCustomParams={handleCustomParams}
            >
                {getChartToRender()}
            </ChartContainer>
        </div>
    );
};

export default MetricsChart;
