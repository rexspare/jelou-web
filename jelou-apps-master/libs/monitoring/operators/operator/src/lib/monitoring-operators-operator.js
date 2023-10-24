import React, { useRef, useEffect, useState, useContext } from "react";
// import dayjs from "dayjs";
import Header from "./header/header";
import OperatorChatSummary from "./operator-chat-summary/operator-chat-summary";
import OperatorEmailSummary from "./operator-email-summary/operator-email-summary";
import OperatorConnections from "./operator-connections/operator-connections";
import { useLocation, useParams } from "react-router-dom";
import { JelouApiV1, DashboardServer, Emitter } from "@apps/shared/modules";
import { OperatorFilter } from "@apps/monitoring/ui-shared";
import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import FileDownload from "js-file-download";
import {
    useOperatorLogs,
    useOperatorStats,
    useOperatorLogTrends,
    useOperatorEmails,
    useOperatorEmailStats,
    useOperatorEmailAttentionTotals,
} from "@apps/shared/hooks";
import { useConversationCases } from "@apps/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { mergeById } from "@apps/shared/utils";
import OperatorLayout from "./operator-layout/operator-layout";
import { DateContext } from "@apps/context";

const Operator = (props) => {
    const { openImpersonate, botEmail, teamOptions, loadingImpersonate } = props;

    const dayjs = useContext(DateContext);
    const TODAY = [dayjs().startOf("day").format(), dayjs().endOf("day").format()];
    const LAST_24_HOURS = [dayjs().add(-1, "day").format(), dayjs().format()];

    const queryClient = useQueryClient();
    const company = useSelector((state) => state.company);
    let location = useLocation();
    const { subsection: operatorId } = useParams();
    const { state } = location;
    let { operator, user = {} } = state;
    const [operatorSelected, setOperatorSelected] = useState(operator);
    const DEFAULT_DATE = company.properties?.has24HoursAttention ? LAST_24_HOURS : TODAY;
    const [date, setDate] = useState(DEFAULT_DATE);
    const dateRef = useRef(date);
    dateRef.current = date;

    // Manage Tabs and Subtabs
    const [selectChat, setSelectChat] = useState(true);
    const [selectTicket, setSelectTicket] = useState(false);
    const [selectManagementSummary, setSelectManshowManagementSummary] = useState(true);
    const [selectConnections, setSelectConnections] = useState(false);
    // Retrieve Operator's Logs
    const [logsPage, setLogsPage] = useState(1);
    const [logsMaxPage, setLogsMaxPage] = useState(1);
    const [logsRows, setLogsRows] = useState(10);
    const [logsTotal, setLogsTotal] = useState(0);
    const [loadingLogsDownload, setLoadingLogsDownload] = useState(false);
    // Retrieve Conversation Cases
    const [casesData, setCasesData] = useState([]);
    const [casesPage, setCasesPage] = useState(1);
    const [casesMaxPage, setCasesMaxPage] = useState(1);
    const [casesRows, setCasesRows] = useState(10);
    const [casesTotal, setCasesTotal] = useState(0);
    // Retrieve Emails Cases
    const [emailsData, setEmailsData] = useState([]);
    const [emailsPage, setEmailsPage] = useState(1);
    const [emailsMaxPage, setEmailsMaxPage] = useState(1);
    const [emailsRows, setEmailsRows] = useState(50);
    const [emailsTotal, setEmailsTotal] = useState(0);
    const [emailStatus, setEmailStatus] = useState("");

    const {
        isFetching: isFetchingChatTrends,
        isLoading: isLoadingChatTrends,
        data: chatTrends = [],
        refetch: refetchOperatorStats,
    } = useOperatorStats(company, user, { date });
    const {
        isFetching: isFetchingLogs,
        isLoading: isLoadingLogs,
        data: logs = [],
        refetch: refetchOperatorLogs,
    } = useOperatorLogs(operator, { date, page: logsPage, limit: logsRows });
    const {
        isFetching: isFetchingLogTrends,
        isLoading: isLoadingLogTrends,
        data: logTrends = [],
        refetch: refetchOperatorTrends,
    } = useOperatorLogTrends(operator, { date });
    const {
        isFetching: isFetchingEmailAttention,
        isLoading: isLoadingEmailAttention,
        data: emailAttention = {},
        refetch: refetchOperatorEmailAttention,
    } = useOperatorEmailAttentionTotals(company, operator, { date });
    const {
        isFetching: isFetchingEmailStats,
        isLoading: isLoadingEmailStats,
        data: emailStats = {},
        refetch: refetchOperatorEmailStats,
    } = useOperatorEmailStats(company, operator, { date });
    const {
        isFetching: isFetchingConversationCases,
        isLoading: isLoadingCases,
        data: conversationCases = [],
        status: conversationCasesStatus,
        refetch: refetchOperatorConversations,
    } = useConversationCases(company, operator, {
        date,
        page: casesPage,
        limit: casesRows,
        operatorId,
    });
    const {
        isFetching: isFetchingOperatorEmails,
        isLoading: isLoadingEmails,
        data: operatorEmails = [],
        status: operatorEmailsStatus,
        refetch: refetchOperatorEmails,
    } = useOperatorEmails(company, operator, {
        date,
        page: emailsPage,
        limit: emailsRows,
        operatorId,
        status: emailStatus,
    });

    const stopEvents = (date) => {
        const initialDate = date[0];
        const finalDate = date[1];
        const _LAST_24_HOURS = [dayjs().add(-1, "day").format(), dayjs().format()];
        const _TODAY = [dayjs().startOf("day").format(), dayjs().endOf("day").format()];
        const DEFAULT_DATE = company.properties?.has24HoursAttention ? _LAST_24_HOURS : _TODAY;
        const todayInitial = DEFAULT_DATE[0];
        const todayFinal = DEFAULT_DATE[1];
        const isEqual = initialDate === todayInitial && finalDate === todayFinal;
        if (!isEqual) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        Emitter.on("conversation-totals-operator", (payload) => {
            updateConverationStats(payload);
        });
        Emitter.on("conversation-end", (payload) => {
            deleteConversation(payload);
        });
        Emitter.on("conversation-first-response", (payload) => {
            updateConversation(payload);
        });
        Emitter.on("conversation-transfer", (payload) => {
            deleteConversation(payload);
        });
        Emitter.on("conversation-start", (payload) => {
            startConversation(payload);
        });
        Emitter.on("support-tickets-update", (payload) => {
            updateEmail(payload);
        });
        Emitter.on("support-tickets-totals", (payload) => {
            updateEmailTotals(payload);
        });
        Emitter.on("support-tickets-stats", (payload) => {
            updateEmailStats(payload);
        });
        Emitter.on("support-tickets-assign", (payload) => {
            assignEmail(payload);
        });
        Emitter.on("operator-login", (payload) => {
            if (isEmpty(payload)) return;
            operatorLogIn(payload);
        });
        Emitter.on("operator-logout", (payload) => {
            if (isEmpty(payload)) return;
            operatorLogOut(payload);
        });
        Emitter.on("operator-status-update", (payload) => {
            if (isEmpty(payload)) return;
            operatorStatusUpdate(payload);
        });
        return () => {
            Emitter.off("conversation-totals-operator");
            Emitter.off("conversation-end");
            Emitter.off("conversation-first-response");
            Emitter.off("conversation-transfer");
            Emitter.off("conversation-start");
            Emitter.off("support-tickets-update");
            Emitter.off("support-tickets-totals");
            Emitter.off("support-tickets-stats");
            Emitter.off("support-tickets-assign");
            Emitter.off("operator-login");
            Emitter.off("operator-logout");
            Emitter.off("operator-status-update");
        };
    }, []);

    useEffect(() => {
        if (conversationCasesStatus === "success") {
            setCasesData(get(conversationCases, "results", []));
            setCasesMaxPage(get(conversationCases, "pagination.totalPages", 1));
            setCasesTotal(get(conversationCases, "pagination.total", 0));
        }
    }, [conversationCases]);

    useEffect(() => {
        if (operatorEmailsStatus === "success") {
            setEmailsData(get(operatorEmails, "results", []));
            setEmailsMaxPage(get(operatorEmails, "pagination.totalPages", 1));
            setEmailsTotal(get(operatorEmails, "pagination.total", 0));
        }
    }, [operatorEmails]);

    useEffect(() => {
        setLogsMaxPage(get(logs, "pagination.totalPages", 1));
        setLogsTotal(get(logs, "pagination.total", 0));
    }, [logs]);

    const updateConverationStats = (payloadData) => {
        if (stopEvents(dateRef.current)) return;
        const { totalsOperators } = payloadData;
        queryClient.setQueriesData(["getOperatorStats"], (OperatorStats) => {
            const update = (operator) => {
                const totalsByOperator = totalsOperators.find((total) => get(total, "_id") === get(operator, "_id"));
                return totalsByOperator ? { ...totalsByOperator } : operator;
            };
            return update(OperatorStats);
        });
    };

    const startConversation = (payload) => {
        if (stopEvents(dateRef.current)) return;
        const eventId = payload._id;
        try {
            JelouApiV1.get(`/real-time-events/${eventId}`).then((data) => {
                const payloadData = get(data, "data.data.payload", {});
                queryClient.setQueriesData(["conversationCases"], (OldConversationCases) => {
                    const _operator = get(payloadData, "operator.id", "");
                    if (operatorId === _operator) {
                        const results = get(OldConversationCases, "results", []);
                        const _results = [...results, payloadData];
                        return { ...OldConversationCases, results: _results };
                    }
                });
            });
        } catch (error) {
            console.log(error, "error");
        }
    };

    const deleteConversation = (payload) => {
        if (stopEvents(dateRef.current)) return;
        const eventId = payload._id;
        try {
            JelouApiV1.get(`/real-time-events/${eventId}`).then((data) => {
                const payloadData = get(data, "data.data.payload", {});

                queryClient.setQueriesData(["conversationCases"], (OldConversationCases) => {
                    const results = get(OldConversationCases, "results", []);
                    const _results = results.filter((conversation) => get(conversation, "_id") !== payloadData._id);
                    return { ...OldConversationCases, results: _results };
                });
            });
        } catch (error) {
            console.log(error, "error");
        }
    };

    const updateConversation = (payload) => {
        if (stopEvents(dateRef.current)) return;
        const eventId = payload._id;
        try {
            JelouApiV1.get(`/real-time-events/${eventId}`).then((data) => {
                const payloadData = get(data, "data.data.payload", {});
                queryClient.setQueriesData(["conversationCases"], (OldConversationCases) => {
                    const results = get(OldConversationCases, "results", []);
                    const update = (conversationCase) => {
                        const conversation = conversationCase.find((conversation) => get(conversation, "_id") === payloadData._id);
                        const _tmp = !isEmpty(conversation)
                            ? {
                                  ...conversation,
                                  wasReplied: payload.wasReplied,
                              }
                            : conversation;
                        return [...conversationCase, _tmp];
                    };

                    const _results = update(results);
                    return { ...OldConversationCases, results: _results };
                });
            });
        } catch (error) {
            console.log(error, "error");
        }
    };

    const updateEmail = (payload) => {
        if (stopEvents(dateRef.current)) return;
        const eventId = payload._id;
        try {
            JelouApiV1.get(`/real-time-events/${eventId}`).then((data) => {
                const payloadData = get(data, "data.data.payload", {});
                const status = get(payloadData, "status", "");
                const _operator = Number(get(payloadData, "assignedTo.id", ""));
                if (emailStatus !== status) return;

                queryClient.setQueriesData(["emailsCases"], (OldEmailCases) => {
                    const results = get(OldEmailCases, "results", []);
                    let _results = [];
                    if (Number(operatorId) === _operator) {
                        _results = mergeById(results, payloadData, "_id");
                        return { ...OldEmailCases, results: _results };
                    } else {
                        _results = results.filter((ticket) => get(ticket, "assignedTo.id") !== _operator);
                        return { ...OldEmailCases, results: _results };
                    }
                });
            });
        } catch (error) {
            console.log(error, "error");
        }
    };

    const updateEmailTotals = (payload) => {
        if (stopEvents(dateRef.current)) return;
        const { totalsByOperator } = payload;
        const emailTotals = totalsByOperator.filter((operator) => Number(get(operator, "_id")) === Number(operatorId));
        if (emailTotals) {
            const _emailTotals = emailTotals[0];
            queryClient.setQueriesData(["getEmailTotals"], (OldEmailTotals) => {
                return { ...OldEmailTotals, ..._emailTotals };
            });
        }
    };

    const updateEmailStats = (payload) => {
        if (stopEvents(dateRef.current)) return;
        const statsByOperator = get(payload, "statsByOperator", []);
        const operatorStats = statsByOperator.find((operator) => Number(get(operator, "_id")) === Number(operatorId));
        if (!isEmpty(operatorStats)) {
            queryClient.setQueriesData(["getEmailStats"], () => {
                return operatorStats;
            });
        }
    };

    const assignEmail = (payload) => {
        if (stopEvents(dateRef.current)) return;
        const { supportTicket } = payload;
        const status = get(supportTicket, "status");
        if (status === emailStatus) {
            queryClient.setQueriesData(["emailsCases"], (OldEmailCases) => {
                const results = get(OldEmailCases, "results", []);
                const _results = mergeById(results, supportTicket, "_id");
                return { ...OldEmailCases, results: _results };
            });
        }
    };

    const operatorLogIn = async (payload) => {
        try {
            const eventId = payload._id;
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const status = get(payloadEvent, "status", "");
                const loggedInAt = get(payloadEvent, "loggedInAt", "");
                const operatorId = get(payloadEvent, "id", "");

                if (operatorId === get(operatorSelected, "id")) {
                    setOperatorSelected((prevState) => ({
                        ...prevState,
                        loggedInAt,
                        active: status,
                    }));
                }
                queryClient.setQueriesData(["getOperatorsTable"], (oldDataOperator) => {
                    const results = get(oldDataOperator, "results", []);
                    const update = (user) => {
                        return get(user, "Operator.id") === operatorId
                            ? { ...user, Operator: { ...user.Operator, loggedInAt, status }, operatorActive: status }
                            : user;
                    };
                    const _results = results.map(update);
                    return { ...oldDataOperator, results: _results };
                });
            });
        } catch (error) {
            console.log(error, "error");
        }
    };

    const operatorLogOut = (payload) => {
        try {
            const eventId = payload._id;
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const status = get(payloadEvent, "status", "");
                const loggedOutAt = get(payloadEvent, "loggedOutAt", "");
                const operatorId = get(payloadEvent, "id", "");

                if (operatorId === get(operatorSelected, "id")) {
                    setOperatorSelected((prevState) => ({
                        ...prevState,
                        loggedOutAt,
                        active: status,
                    }));
                }
                queryClient.setQueriesData(["getOperatorsTable"], (oldDataOperator) => {
                    const results = get(oldDataOperator, "results", []);
                    const update = (user) => {
                        return get(user, "Operator.id") === operatorId
                            ? { ...user, Operator: { ...user.Operator, loggedOutAt, status }, operatorActive: status }
                            : user;
                    };
                    const _results = results.map(update);
                    return { ...oldDataOperator, results: _results };
                });
            });
        } catch (err) {
            console.log(err);
        }
    };

    const operatorStatusUpdate = (payload) => {
        try {
            const eventId = payload._id;
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const status = get(payloadEvent, "status", "");
                const operatorId = get(payloadEvent, "id", "");

                if (operatorId === get(operatorSelected, "id")) {
                    setOperatorSelected((prevState) => ({
                        ...prevState,
                        active: status,
                    }));
                }
                queryClient.setQueriesData(["getOperatorsTable"], (oldDataOperator) => {
                    const results = get(oldDataOperator, "results", []);
                    const update = (user) => {
                        return get(user, "Operator.id") === operatorId
                            ? { ...user, Operator: { ...user.Operator, status }, operatorActive: status }
                            : user;
                    };
                    const _results = results.map(update);
                    return { ...oldDataOperator, results: _results };
                });
            });
        } catch (err) {
            console.log(err);
        }
    };

    const downloadActualCases = async () => {
        try {
            if (!isEmpty(company)) {
                const [startAt, endAt] = date;
                const { data } = await JelouApiV1.get(`/company/${company.id}/conversations`, {
                    params: {
                        download: true,
                        operatorId,
                        startAt,
                        endAt,
                        ...(stopEvents(date) ? {} : { event: "active" }),
                    },
                    responseType: "blob",
                });
                FileDownload(data, `chatCasesReport_${operatorId}_${dayjs().format()}.xlsx`);
            }
        } catch (error) {
            console.log("error ", error);
        }
    };

    const downloadLogs = async () => {
        try {
            const [startAt, endAt] = date;
            const params = {
                download: true,
                startAt,
                endAt,
            };
            if (!isEmpty(company)) {
                const { id = operatorId } = operator;
                setLoadingLogsDownload(true);

                const { data } = await JelouApiV1.post(`/operators/${id}/logs`, params);

                if (has(data, "download")) {
                    const link = document.createElement("a");
                    link.href = data.download[0].fileUrl;
                    link.setAttribute("download", `logs_${dayjs().format()}.xls`);
                    document.body.appendChild(link);
                    link.click();
                }
            }
            setLoadingLogsDownload(false);
        } catch (error) {
            setLoadingLogsDownload(false);
            console.log(error, " error");
        }
    };

    const downloadActualEmails = async () => {
        try {
            if (!isEmpty(company)) {
                const [startAt, endAt] = date;
                const { data } = await DashboardServer.get(`/companies/${company.id}/tickets/getTickets`, {
                    params: {
                        download: true,
                        operatorId,
                        startAt,
                        endAt,
                        ...(emailStatus ? { status: emailStatus } : {}),
                        sort: "DESC",
                    },
                    responseType: "blob",
                });
                FileDownload(data, `ticketsCasesReport_${operatorId}_${dayjs().format()}.xlsx`);
            }
        } catch (error) {
            console.log(error, " error");
        }
    };

    const dateChange = (range) => {
        setLogsPage(1);
        let [startDate, endDate] = range;
        setDate([startDate, endDate]);
    };

    const clearDate = () => {
        const _LAST_24_HOURS = [dayjs().add(-1, "day").format(), dayjs().format()];
        const _TODAY = [dayjs().startOf("day").format(), dayjs().endOf("day").format()];
        const DEFAULT_DATE = company.properties?.has24HoursAttention ? _LAST_24_HOURS : _TODAY;
        setDate(DEFAULT_DATE);
    };

    const showChats = () => {
        setSelectChat(true);
        setSelectTicket(false);
    };

    const showTickets = () => {
        setSelectChat(false);
        setSelectTicket(true);
    };

    const showManagementSummary = () => {
        setSelectManshowManagementSummary(true);
        setSelectConnections(false);
    };

    const showConnections = () => {
        setSelectManshowManagementSummary(false);
        setSelectConnections(true);
    };

    const marked1 = selectManagementSummary
        ? "bg-transparent border-primary-200 hover:border-primary-200 text-primary-200"
        : "bg-transparent border-transparent hover:border-primary-200 hover:text-primary-200 text-gray-400";

    const marked2 = selectConnections
        ? "bg-transparent border-primary-200 hover:border-primary-200 text-primary-200"
        : "bg-transparent border-transparent hover:border-primary-200 hover:text-primary-200 text-gray-400";

    const reload = async () => {
        refetchOperatorStats();
        refetchOperatorLogs();
        refetchOperatorTrends();
        refetchOperatorConversations();
        refetchOperatorEmailAttention();
        refetchOperatorEmailStats();
        refetchOperatorEmails();
    };

    const operatorTeams = teamOptions.filter((team) => operatorSelected?.Teams?.some((operatorTeam) => operatorTeam.id === team.id));

    return (
        <OperatorLayout>
            <div className="flex h-full flex-col">
                <Header operator={operatorSelected} openImpersonate={openImpersonate} loadingImpersonate={loadingImpersonate} />
                <OperatorFilter
                    selectChat={selectChat}
                    selectTicket={selectTicket}
                    showChats={showChats}
                    showTickets={showTickets}
                    clearDate={clearDate}
                    dateChange={dateChange}
                    marked1={marked1}
                    marked2={marked2}
                    showManagementSummary={showManagementSummary}
                    showConnections={showConnections}
                    reload={reload}
                    user={user}
                    botEmail={botEmail}
                    selectConnections={selectConnections}
                    date={date}
                    operatorTeams={operatorTeams}
                />
                {selectManagementSummary && (
                    <div className="h-full">
                        {selectChat && (
                            <OperatorChatSummary
                                operatorId={operatorId}
                                casesData={casesData}
                                chatsTrend={chatTrends}
                                attentionTrend={chatTrends}
                                casesPage={casesPage}
                                casesMaxPage={casesMaxPage}
                                setCasesPage={setCasesPage}
                                casesRows={casesRows}
                                setCasesRows={setCasesRows}
                                setCasesMaxPage={setCasesMaxPage}
                                loadingCases={isLoadingCases || isFetchingConversationCases}
                                casesTotal={casesTotal}
                                downloadActualCases={downloadActualCases}
                                isLoadingChatTrends={isLoadingChatTrends || isFetchingChatTrends}
                            />
                        )}
                        {selectTicket && (
                            <OperatorEmailSummary
                                emailAttention={emailAttention}
                                emailStats={emailStats}
                                isLoadingEmailAttention={isLoadingEmailAttention || isFetchingEmailAttention}
                                isLoadingEmailStats={isLoadingEmailStats || isFetchingEmailStats}
                                emailsData={emailsData}
                                emailsPage={emailsPage}
                                setEmailsPage={setEmailsPage}
                                emailsMaxPage={emailsMaxPage}
                                emailsRows={emailsRows}
                                setEmailsRows={setEmailsRows}
                                emailsTotal={emailsTotal}
                                isLoadingEmails={isLoadingEmails || isFetchingOperatorEmails}
                                setEmailStatus={setEmailStatus}
                                teamOptions={teamOptions}
                                downloadActualEmails={downloadActualEmails}
                                emailStatus={emailStatus}
                            />
                        )}
                    </div>
                )}
                {selectConnections && (
                    <div className="h-full">
                        <OperatorConnections
                            logsData={get(logs, "results", [])}
                            logsTrend={logTrends}
                            logsPageLimit={logsPage}
                            logsMaxPage={logsMaxPage}
                            setLogsPageLimit={setLogsPage}
                            logsRows={logsRows}
                            setLogsRows={setLogsRows}
                            isLoadingLogs={isLoadingLogs || isFetchingLogs}
                            logsTotal={logsTotal}
                            downloadLogs={downloadLogs}
                            loadingLogsDownload={loadingLogsDownload}
                            isLoadingLogTrends={isLoadingLogTrends || isFetchingLogTrends}
                        />
                    </div>
                )}
            </div>
        </OperatorLayout>
    );
};

export default Operator;
