import "dayjs/locale/es";
import axios from "axios";
import get from "lodash/get";
import has from "lodash/has";
import { v4 as uuid } from "uuid";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import reverse from "lodash/reverse";
import { ClipLoader } from "react-spinners";
import { useState, useEffect, useContext } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { useOperatorData } from "@apps/shared/hooks";

import Metrics from "./components/Metrics";
import { JelouApiV1 } from "@apps/shared/modules";
import { Tabs, KIAFilters } from "@apps/monitoring/ui-shared";
import { addTeamScopes } from "@apps/redux/store";
import AssignedCases from "./components/AssignedCases";
import MissedConversations from "./components/MissedConversation";
import { ComboboxSelect, DateRangePicker, MultiCombobox } from "@apps/shared/common";
import { BotIcon, DateIcon, DownloadIcon, OperatorIcon, TeamIcon } from "@apps/shared/icons";
import NotDerivedMetrics from "./components/NotDerivedMetrics";
import { DateContext } from "@apps/context";
import Tippy from "@tippyjs/react";

const Reports = (props) => {
    const dispatch = useDispatch();
    const dayjs = useContext(DateContext);

    const TODAY = [dayjs().startOf("day").format(), dayjs().endOf("day").format()];
    const LAST_24_HOURS = [dayjs().add(-1, "day").format(), dayjs().format()];

    const {
        t,
        teamOptions,
        botOptions,
        ifKia,
        filteredCategory,
        setFilteredCategory,
        filteredAgencies,
        setFilteredAgencies,
        filteredGroups,
        setFilteredGroups,
        filteredCities,
        setFilteredCities,
        filtersKia,
        setFiltersKia,
        cleanFilters,
        setCleanFilters,
        kiaParams,
    } = props;
    const company = useSelector((state) => state.company);
    const teamScopes = useSelector((state) => state.teamScopes);
    const userSession = useSelector((state) => state.userSession);
    const [teamSelected, setTeamSelected] = useState("");
    const [operatorSelected, setOperatorSelected] = useState("");
    const [botSelected, setBotSelected] = useState("");
    const DEFAULT_DATE = company.properties?.has24HoursAttention ? LAST_24_HOURS : TODAY;
    const [initialDate, setInitialDate] = useState(DEFAULT_DATE[0]);
    const [finalDate, setFinalDate] = useState(DEFAULT_DATE[1]);
    const [data, setData] = useState([]);
    const [pageLimit, setPageLimit] = useState(1);
    const [row, setRows] = useState(10);
    const [rowNotAssigned, setRowsNotAssigned] = useState(10);
    const [pageLimitNotAssigned, setPageLimitNotAssigned] = useState(1);
    const [assignedNumber, setAssignedNumber] = useState("--");
    const [notAssignedNumber, setNotAssignedNumber] = useState("--");
    const [loading, setLoading] = useState(false);
    const [loadingNotAssigned, setLoadingNotAssigned] = useState(true);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [maxPage, setMaxPage] = useState(null);
    const [notAssignedTable, setNotAssignedTable] = useState(false);
    const [assignedTable, setAssignedTable] = useState(true);
    const [notAssignedCases, setNotAssignedCases] = useState([]);
    const [maxPageNotAssigned, setMaxPageNotAssigned] = useState(null);
    const [totalsByTeams, setTotalsByTeams] = useState([]);
    const [loadingMetrics, setLoadingMetrics] = useState(false);
    const [colum, setColum] = useState([]);
    const [operatorNotFound, setOperatorNotFound] = useState("-");
    const [operatorNotSchedule, setOperatorNotSchedule] = useState("-");
    const [selectedOptions, setSelectedOptions] = useState({ date: DEFAULT_DATE });

    const hasDifMetrics = get(company, "properties.monitoring.hasPersonalizedMetrics", false);
    let extraRow = get(company, "properties.reports.conversationsAttended", false);
    let customRows = get(company, "properties.reports.customConversationsNotAttended", false) && ifKia;

    const monitorAllTeams = get(userSession, "monitorAllTeams", false);
    const userScopes = monitorAllTeams ? [] : get(userSession, "teamScopes", []);

    const { subsection } = useParams();
    const [cancelTokenAttended, setCancelTokenAttended] = useState();
    const [cancelTokenNotAttended, setCancelTokenNotAttended] = useState();
    const [cancelTokenNotAttendedTotals, setCancelTokenNotAttendedTotals] = useState();
    const [cancelTokenConversations, setCancelTokenConversations] = useState();
    const { data: operatorOptions = [] } = useOperatorData(company, { shouldPaginate: false, team: teamSelected }, kiaParams);

    const uniqueBot = botOptions.length === 1;
    useEffect(() => {
        if (!isEmpty(extraRow) && ifKia) {
            let arr = [];
            let colu = [];
            extraRow = extraRow.split(",");
            extraRow.map((data) => {
                arr = data.split(":");
                colu.push({
                    Header: arr[0],
                    accessor: arr[1],
                });
                setColum(colu);
                return colu;
            });
        }
    }, [extraRow]);

    const marked1 = assignedTable;
    const marked2 = notAssignedTable;

    const showAssignedTable = () => {
        setNotAssignedTable(false);
        setAssignedTable(true);
    };

    const showNotAssignedTable = () => {
        setNotAssignedTable(true);
        setAssignedTable(false);
    };

    useEffect(() => {
        return () => {
            addTeamScopes(userScopes);
        };
    }, []);

    useEffect(() => {
        if (!isEmpty(company)) {
            //filtros
            getAttendedConversations();
            getDailyStats();
        }
    }, [company, teamSelected, operatorSelected, botSelected, row, pageLimit, cleanFilters, filtersKia]);

    useEffect(() => {
        if (!isEmpty(company) && !isEmpty(botOptions)) {
            //filtros
            getNotAttendedConversations();
            notAttendedTotals();
        }
    }, [company, botOptions, teamSelected, operatorSelected, botSelected, rowNotAssigned, pageLimitNotAssigned, cleanFilters, filtersKia]);

    const dateChange = (range) => {
        const [startDate, endDate] = range;

        setSelectedOptions({ ...selectedOptions, date: [dayjs(startDate).format(), dayjs(endDate).format()] });

        setInitialDate(dayjs(startDate).format());
        setFinalDate(dayjs(endDate).format());
    };

    useEffect(() => {
        if (!isEmpty(initialDate) && !isEmpty(finalDate)) {
            setPageLimit(1);
            setPageLimitNotAssigned(1);
            setRows(10);
            setRowsNotAssigned(10);
            getAttendedConversations();
            getDailyStats();
            getNotAttendedConversations();
            setOperatorNotFound("-");
            setOperatorNotSchedule("-");
            notAttendedTotals();
        }
    }, [initialDate, finalDate]);

    const getAttendedConversations = async (download) => {
        if (!isEmpty(cancelTokenAttended)) {
            await cancelTokenAttended.cancel("Operation canceled due to new request.");
        }
        try {
            const source = axios.CancelToken.source();
            setCancelTokenAttended(source);

            if (!download) setLoading(true);
            setLoadingDownload(true);
            const { data } = await JelouApiV1.post(
                `/metrics/conversations/attended?limit=${row}&page=${pageLimit}`,
                {
                    ...(!initialDate ? { startAt: DEFAULT_DATE[0] } : { startAt: initialDate }),
                    ...(!finalDate ? { endAt: DEFAULT_DATE[1] } : { endAt: finalDate }),
                    getJson: true,
                    ...(!isEmpty(botSelected) && !uniqueBot
                        ? {
                              botId: botSelected.map((bot) => {
                                  return bot.id;
                              }),
                          }
                        : {}),
                    ...(uniqueBot && download ? { botId: [botOptions[0].id] } : {}),

                    download: download,
                    ...(download ? { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } : {}),
                    ...(!isEmpty(teamScopes) ? { teams: teamScopes } : {}),
                    ...(!isEmpty(operatorSelected) ? { operatorId: operatorSelected.operatorId } : {}),

                    ...(ifKia && filtersKia && !cleanFilters
                        ? {
                              storedParams: {
                                  ...(!isEmpty(filteredCategory) ? { category: filteredCategory.name } : {}),
                                  ...(!isEmpty(filteredAgencies) ? { agency: filteredAgencies.name } : {}),
                                  ...(!isEmpty(filteredGroups) ? { group: filteredGroups.name } : {}),
                                  ...(!isEmpty(filteredCities) ? { city: filteredCities.name } : {}),
                              },
                          }
                        : {}),
                },

                {
                    cancelToken: source.token,
                    auth: {
                        username: company.clientId,
                        password: company.clientSecret,
                    },
                }
            );
            if (has(data, "download")) {
                const link = document.createElement("a");
                link.href = data.download[0].fileUrl;
                document.body.appendChild(link);
                link.click();
            }
            setLoading(false);
            setMaxPage(data.pagination.totalPages);
            setData(reverse(data.results));
            setAssignedNumber(data.pagination.total);
            setLoadingDownload(false);
        } catch (error) {
            if (toUpper(error.message) === "CANCELLING") {
                setLoading(true);
            } else {
                setLoading(false);
            }
            setLoadingDownload(false);
            console.log("error == ", error);
        }
    };

    const getNotAttendedConversations = async (download) => {
        if (!isEmpty(cancelTokenNotAttended)) {
            await cancelTokenNotAttended.cancel("Operation canceled due to new request.");
        }
        try {
            const source = axios.CancelToken.source();
            setCancelTokenNotAttended(source);

            let payload = {
                limit: rowNotAssigned,
                page: pageLimitNotAssigned,
                startAt: initialDate,
                endAt: finalDate,
                getJson: true,
                download: download,
                ...(!isEmpty(botSelected)
                    ? {
                          botIds: botSelected.map((bot) => bot.id),
                      }
                    : { botIds: botOptions.map((bot) => bot.id) }),
                ...(!isEmpty(teamScopes) ? { teams: teamScopes } : {}),
                ...(company ? { resourceId: company.properties.resourceId } : { resourceId: [] }),
                ...(ifKia && filtersKia && !cleanFilters
                    ? {
                          storedParams: {
                              ...(!isEmpty(filteredCategory) ? { category: filteredCategory.name } : {}),
                              ...(!isEmpty(filteredAgencies) ? { agency: filteredAgencies.name } : {}),
                              ...(!isEmpty(filteredGroups) ? { group: filteredGroups.name } : {}),
                              ...(!isEmpty(filteredCities) ? { city: filteredCities.name } : {}),
                          },
                      }
                    : {}),
            };

            if (!download) setLoadingNotAssigned(true);
            setLoadingDownload(true);
            const {
                data: { data },
            } = await JelouApiV1.post(
                `/metrics/conversations/notAttended`,
                {
                    ...payload,
                },
                {
                    cancelToken: source.token,
                }
            );

            const hasDownload = has(data, "download");
            setLoadingNotAssigned(false);
            setMaxPageNotAssigned(data.pagination.totalPages);
            if (hasDownload) {
                const link = document.createElement("a");
                link.href = data.download[0].fileUrl;
                document.body.appendChild(link);
                link.click();
            }
            setLoadingDownload(false);
            setNotAssignedCases(reverse(data.results));
            setNotAssignedNumber(data.pagination.total);
        } catch (error) {
            setNotAssignedNumber(0);
            if (toUpper(error.message) === "CANCELLING") {
                setLoadingNotAssigned(true);
            } else {
                setLoadingNotAssigned(false);
            }
            setLoadingNotAssigned(false);
            setLoadingDownload(false);
        }
    };

    const getDailyStats = async () => {
        if (!isEmpty(cancelTokenConversations)) {
            await cancelTokenConversations.cancel("Operation canceled due to new request daily stats.");
        }
        try {
            const source = axios.CancelToken.source();
            setCancelTokenConversations(source);

            setLoadingMetrics(true);
            const { data } = await JelouApiV1.get(`/company/${company.id}/conversations`, {
                params: {
                    page: pageLimit,
                    limit: row,
                    ...(!isEmpty(teamScopes) ? { teams: teamScopes } : {}),
                    startAt: initialDate,
                    endAt: finalDate,
                    ...(!isEmpty(botSelected)
                        ? {
                              botId: botSelected.map((bot) => bot.id),
                          }
                        : {}),
                    ...(!isEmpty(operatorSelected) ? { operatorId: operatorSelected.operatorId } : {}),
                    ...(ifKia && filtersKia && !cleanFilters
                        ? {
                              storedParams: {
                                  ...(!isEmpty(filteredCategory) ? { category: filteredCategory.name } : {}),
                                  ...(!isEmpty(filteredAgencies) ? { agency: filteredAgencies.name } : {}),
                                  ...(!isEmpty(filteredGroups) ? { group: filteredGroups.name } : {}),
                                  ...(!isEmpty(filteredCities) ? { city: filteredCities.name } : {}),
                              },
                          }
                        : {}),
                },
                cancelToken: source.token,
            });

            let { totalsByTeam } = data;
            if (!isEmpty(totalsByTeam)) {
                let totalsActual = [];
                let totals;
                totalsByTeam.forEach((object) => {
                    let { total } = object;
                    object.id = object._id;
                    totalsActual.push(total);
                    totals = totalsActual.reduce((a, b) => a + b, 0);
                });
                setAssignedNumber(totals);
                setTotalsByTeams(totalsByTeam);
            } else {
                setAssignedNumber(0);
                setTotalsByTeams(totalsByTeam);
            }
            setLoadingMetrics(false);
        } catch (error) {
            if (toUpper(error.message) === "CANCELLING") {
                setLoadingMetrics(true);
            } else {
                setLoadingMetrics(false);
            }
            console.log("error ", error);
        }
    };

    const notAttendedTotals = async () => {
        if (!isEmpty(cancelTokenNotAttendedTotals)) {
            await cancelTokenNotAttendedTotals.cancel("Operation canceled due to new request.");
        }
        try {
            const source = axios.CancelToken.source();
            setCancelTokenNotAttendedTotals(source);
            const { clientId: username, clientSecret: password } = company;

            if (!isEmpty(username) && !isEmpty(password)) {
                const { data } = await JelouApiV1.post(
                    `/metrics/conversations/notAttended/totals`,
                    {
                        limit: 10,
                        page: 1,
                        startAt: initialDate,
                        endAt: finalDate,
                        ...(!isEmpty(botSelected)
                            ? { botIds: botSelected.map((bot) => bot.id) }
                            : {
                                  botIds: botOptions.map((bot) => bot.id),
                              }),
                        ...(!isEmpty(teamScopes) ? { teams: teamScopes } : {}),
                        ...(ifKia && filtersKia && !cleanFilters
                            ? {
                                  storedParams: {
                                      ...(!isEmpty(filteredCategory) ? { category: filteredCategory.name } : {}),
                                      ...(!isEmpty(filteredAgencies) ? { agency: filteredAgencies.name } : {}),
                                      ...(!isEmpty(filteredGroups) ? { group: filteredGroups.name } : {}),
                                      ...(!isEmpty(filteredCities) ? { city: filteredCities.name } : {}),
                                  },
                              }
                            : {}),
                    },
                    {
                        cancelToken: source.token,
                    }
                );
                const results = data.data;
                if (!isEmpty(results)) {
                    results.forEach((result) => {
                        if (result._id === "OPERATOR_NOT_FOUND") {
                            setOperatorNotFound(result.total);
                        }
                        if (result._id === "OPERATORS_NOT_IN_SCHEDULE") {
                            setOperatorNotSchedule(result.total);
                        }
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const selectBot = (bots) => {
        setPageLimit(1);
        setPageLimitNotAssigned(1);
        setRows(10);
        setRowsNotAssigned(10);
        setBotSelected(bots);
    };

    const selectTeam = (team) => {
        setPageLimit(1);
        setPageLimitNotAssigned(1);
        setTeamSelected(team);
        const selectedTeam = get(team, "id", 0);
        dispatch(addTeamScopes([selectedTeam]));
    };

    const cleanTeamFilter = () => {
        setTeamSelected("");
        if (!isEmpty(userScopes)) {
            dispatch(addTeamScopes(userScopes));
            return;
        }
        dispatch(addTeamScopes([]));
    };

    const selectOperator = (operator) => {
        setPageLimit(1);
        setPageLimitNotAssigned(1);
        setOperatorSelected(operator);
    };

    const clearOperatorsFilter = () => {
        setOperatorSelected("");
        setPageLimit(1);
        setPageLimitNotAssigned(1);
        setRows(10);
        setRowsNotAssigned(10);
    };

    const cleanBotsFilter = () => {
        setBotSelected("");
        setPageLimit(1);
        setPageLimitNotAssigned(1);
        setRows(10);
        setRowsNotAssigned(10);
    };

    const downloadReport = () => {
        if (assignedTable) {
            getAttendedConversations(true);
        } else {
            getNotAttendedConversations(true);
        }
    };

    const cleanKIAFilters = () => {
        setFilteredCategory("");
        setFilteredAgencies("");
        setFilteredGroups("");
        setFilteredCities("");
        setCleanFilters(true);
        setPageLimit(1);
        setPageLimitNotAssigned(1);
        setRows(10);
        setRowsNotAssigned(10);
    };

    const applyKIAFilters = () => {
        const id = uuid();
        setFiltersKia(id);
        setCleanFilters(false);
        setPageLimit(1);
        setPageLimitNotAssigned(1);
        setRows(10);
        setRowsNotAssigned(10);
    };

    const isActiveClassName = " w-fit items-center flex h-[2.5rem] rounded-[0.5rem] px-4 text-15 xxl:text-lg bg-[#EDF7F9] text-primary-200";
    const isNotActiveClassName = "w-fit items-center flex rounded-[0.5rem] px-4 py-1 text-gray-400";

    if (!subsection) {
        return <Navigate from={`/monitoring/cases`} to={`/monitoring/cases/chats`} />;
    }

    return (
        <div>
            <div className="flex h-16 w-full items-center rounded-b-1 border-t-default border-gray-100/25 bg-[#FAFBFC] px-6">
                <div className="mr-5 w-64">
                    {teamOptions.length > 1 && !ifKia && (
                        <ComboboxSelect
                            background="#FAFBFC"
                            value={teamSelected}
                            handleChange={selectTeam}
                            name="team"
                            options={teamOptions}
                            label={t("monitoring.Equipos")}
                            icon={<TeamIcon width="1.3125rem" height="1rem" fillOpacity="0.75" />}
                            placeholder={t("monitoring.Seleccionar Equipo ")}
                            clearFilter={cleanTeamFilter}
                        />
                    )}
                </div>

                <NavLink to={"/monitoring/cases/chats"} className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                    <p className="font-bold">Chats</p>
                </NavLink>

                {/* {botEmail && (
                    <NavLink to={"/monitoring/live/emails"} className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                        <p className="font-bold">Emails</p>
                    </NavLink>
                )} */}
            </div>

            {ifKia && (
                <KIAFilters
                    ifKia={ifKia}
                    filteredCategory={filteredCategory}
                    setFilteredCategory={setFilteredCategory}
                    filteredAgencies={filteredAgencies}
                    setFilteredAgencies={setFilteredAgencies}
                    filteredGroups={filteredGroups}
                    setFilteredGroups={setFilteredGroups}
                    filteredCities={filteredCities}
                    setFilteredCities={setFilteredCities}
                    userScopes={userScopes}
                    getDailyStats={getDailyStats}
                    getAttendedConversations={getAttendedConversations}
                    getNotAttendedConversations={getNotAttendedConversations}
                    notAttendedTotals={notAttendedTotals}
                    setCleanFilters={setCleanFilters}
                    cleanFilters={cleanKIAFilters}
                    applySearch={applyKIAFilters}
                />
            )}

            <div className="mt-8 flex h-16 items-center justify-between rounded-t-xl bg-white px-4">
                <div className="flex">
                    {botOptions.length > 1 && (
                        <div className="mr-5 w-64">
                            <MultiCombobox
                                value={botSelected}
                                handleChange={selectBot}
                                name="team"
                                options={botOptions}
                                icon={<BotIcon width="1.3125rem" height="1rem" />}
                                label={t("Bots")}
                                clearFilter={cleanBotsFilter}
                            />
                        </div>
                    )}

                    <div className="mr-5 w-64">
                        <ComboboxSelect
                            value={operatorSelected}
                            handleChange={selectOperator}
                            name="Operadores"
                            options={operatorOptions}
                            label={t("monitoring.Operadores")}
                            icon={<OperatorIcon width="1.125rem" height="1rem" />}
                            placeholder={t("monitoring.Seleccionar Operador ")}
                            clearFilter={clearOperatorsFilter}
                        />
                    </div>
                    <div className="mr-5 w-64">
                        <DateRangePicker dateValue={selectedOptions.date} icon={<DateIcon width="1rem" height="1.0625rem" fill="#A6B4D0" />} dateChange={dateChange} right canDelete={false} />
                    </div>
                </div>
                <Tippy content={t("common.download")} theme="jelou" arrow={false} placement={"bottom"} touch={false}>
                    <button
                        className="flex h-[1.90rem] w-[1.96rem] items-center justify-center rounded-full bg-primary-200 hover:bg-primary-100 focus:outline-none"
                        onClick={downloadReport}
                        disabled={loadingDownload}
                    >
                        {loadingDownload ? <ClipLoader color={"white"} size="1.1875rem" /> : <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />}
                    </button>
                </Tippy>
            </div>

            <div className="rounded-b-xl pb-10">
                <div className="mx-auto items-center rounded-b-xl border-t-default border-gray-100/25 bg-white">
                    <div className="flex w-full border-b-default border-gray-100/25 bg-white">
                        <Tabs
                            marked1={marked1}
                            marked2={marked2}
                            showFirstTab={showAssignedTable}
                            showSecondTab={showNotAssignedTable}
                            loading={loadingMetrics}
                            title1Number={assignedNumber}
                            title2Number={notAssignedNumber}
                            title1={t("monitoring.Derivados")}
                            title2={t("monitoring.No Derivados")}
                            t={t}
                        />
                    </div>

                    {assignedTable && (
                        <div>
                            <div className="rounded-t-1 bg-white px-4 py-8 sm:px-5 xxl:px-10">
                                <div className="flex w-full space-x-4">
                                    <Metrics hasDifMetrics={hasDifMetrics} loading={loadingMetrics} totalsByTeams={totalsByTeams} />
                                </div>
                            </div>
                            <AssignedCases
                                loading={loading}
                                maxPage={maxPage}
                                data={data}
                                pageLimit={pageLimit}
                                setPageLimit={setPageLimit}
                                setRows={setRows}
                                extraRow={extraRow}
                                colum={colum}
                                customRows={customRows}
                            />
                        </div>
                    )}
                    {notAssignedTable && (
                        <div>
                            <div className="rounded-t-1 bg-white px-4 py-8 sm:px-5 xxl:px-10">
                                <div className="flex w-full space-x-4">
                                    <NotDerivedMetrics loading={loadingMetrics} operatorNotFound={operatorNotFound} operatorNotSchedule={operatorNotSchedule} />
                                </div>
                            </div>
                            <MissedConversations
                                loading={loadingNotAssigned}
                                data={notAssignedCases}
                                pageLimit={pageLimitNotAssigned}
                                setPageLimit={setPageLimitNotAssigned}
                                row={rowNotAssigned}
                                setRows={setRowsNotAssigned}
                                maxPage={maxPageNotAssigned}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(Reports);
