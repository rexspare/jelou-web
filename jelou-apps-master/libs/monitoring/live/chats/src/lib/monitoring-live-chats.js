import qs from "qs";
import axios from "axios";
import get from "lodash/get";
import first from "lodash/first";
import merge from "lodash/merge";
import { v4 as uuid } from "uuid";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import includes from "lodash/includes";
import orderBy from "lodash/orderBy";

import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { filterByKey, msToHMS, secondsToMinutesAndSeconds } from "@apps/shared/utils";
import { JelouApiV1 } from "@apps/shared/modules";

import { deleteById, mergeById } from "@apps/shared/utils";

import Stats from "./stats/stats";
import { Tabs, KIAFilters } from "@apps/monitoring/ui-shared";
import ActualCasesTable from "./actual-cases-table/actual-cases-table";
import RecoverCasesTable from "./pending-cases-table/pending-cases-table";
import QueueCasesTable from "./queue-cases-table/queue-cases-table";
import { Emitter } from "@apps/shared/modules";

export function LiveChats(props) {
    const { t } = useTranslation();

    const {
        //KIA
        ifKia,
        filteredCategory,
        setFilteredCategory,
        filteredAgencies,
        setFilteredAgencies,
        filteredGroups,
        setFilteredGroups,
        filteredCities,
        setFilteredCities,
        getOperators,
        operatorOptions,
        teamSelected,
        teamOptions,
    } = props;

    const userScopes = useSelector((state) => state.teamScopes);
    const company = useSelector((state) => state.company);
    const [cancelToken, setCancelToken] = useState(null);
    const [totalsByTeam, setTotalsByTeam] = useState([]);
    const [loading, setLoading] = useState(false);

    const [totalConversations, setTotalConversations] = useState(0);
    const [actualConversation, setActualConversation] = useState(0);
    const [actualConversationNotReplied, setActualConversationNotReplied] = useState(0);
    const [attendedConversation, setAttendedConversation] = useState(0);
    const [transferedConversation, setTransferedConversation] = useState(0);
    const [notAttendedConversation, setNotAttendedConversation] = useState(0);
    const [avgConversationTime, setAvgConversationTime] = useState("00m 00s");
    const [avgOperatorReply, setAvgOperatorReply] = useState("00m 00s");
    const [averageReply, setAverageReply] = useState("00m 00s");

    const hasDifMetrics = get(company, "properties.monitoring.hasPersonalizedMetrics", false);
    let extraRow = get(company, "properties.reports.conversationsAttended", false);
    let customRows = get(company, "properties.reports.customConversationsNotAttended", false) && ifKia;
    const [colum, setColum] = useState([]);

    //table views

    const [showInQueueTable, setShowInQueueTable] = useState(false);

    const [showActualTable, setShowActualTable] = useState(true);
    const [actualCases, setActualCases] = useState([]);
    const [loadingActualTable, setLoadingActualTable] = useState(false);
    const [totalActualPage, setTotalActualPage] = useState(0);
    const [actualPage, setActualPage] = useState(1);
    const [actualRow, setActualRow] = useState(10);
    const [totalRecoverResults, setTotalRecoverResults] = useState(0);
    const [recoverCases, setRecoverCases] = useState([]);
    const [queueCases, setQueueCases] = useState([]);
    const [totalQueueResults, setTotalQueueResults] = useState(0);

    const totalQueueResultsRef = useRef(totalQueueResults);
    totalQueueResultsRef.current = totalQueueResults;

    const totalRecoverResultsRef = useRef(totalRecoverResults);
    totalRecoverResultsRef.current = totalRecoverResults;

    const queueCasesRef = useRef(queueCases);
    queueCasesRef.current = queueCases;

    const recoverCasesRef = useRef(recoverCases);
    recoverCasesRef.current = recoverCases;

    const actualCasesRef = useRef(actualCases);
    actualCasesRef.current = actualCases;

    const totalRecoverRef = useRef(totalRecoverResults);
    totalRecoverRef.current = totalRecoverRef;

    const userScopesRef = useRef(userScopes);
    userScopesRef.current = userScopes;

    const operatorsRef = useRef(operatorOptions);
    operatorsRef.current = operatorOptions;

    const teamSelectedRef = useRef(teamSelected);
    teamSelectedRef.current = teamSelected;

    const [showRecoverTable, setShowRecoverTable] = useState(false);
    const [loadingRecoverTable, setLoadingRecoverTable] = useState(false);
    const [totalRecoverlPage, setTotalRecoverPage] = useState(0);
    const [recoverPage, setRecoverPage] = useState(1);
    const [recoverRow, setRecoverRow] = useState(10);
    const [selectedReason, setSelectedReason] = useState([]);

    const [loadingQueueTable, setLoadingQueueTable] = useState(false);
    const [totalQueuelPage, setTotalQueuePage] = useState(0);
    const [queuePage, setQueuePage] = useState(1);
    const [queueRow, setQueueRow] = useState(10);
    const hasQueue = get(company, "properties.hasQueue", false);

    const [cleanFilters, setCleanFilters] = useState(false);
    const [filtersKia, setFiltersKia] = useState(false);

    useEffect(() => {
        if (!loadingActualTable) {
            Emitter.on("conversation-totals", (payload) => {
                updateTotalsConverations(payload);
            });
            Emitter.on("conversation-first-response", (payload) => {
                updateConversationFirstResponse(payload);
            });

            Emitter.on("conversation-end", (payload) => {
                deleteConversation(payload);
            });

            Emitter.on("conversation-start", (payload) => {
                startConversation(payload);
            });
            Emitter.on("conversation_not_attended_new", (payload) => {
                console.log("conversation_not_attended_new", payload._id);
                addNewToRecover(payload);
            });
            Emitter.on("conversation_not_attended_update", (payload) => {
                conversationNotAttendedUpdate(payload);
            });

            Emitter.on("conversation_new_ticket", (payload) => {
                addNewToQueue(payload);
            });
            Emitter.on("conversation_update_ticket", (payload) => {
                queueConversationsUpdate(payload);
            });
        }
        return () => {
            Emitter.off("conversation-totals");
            Emitter.off("conversation-first-response");
            Emitter.off("conversation-end");
            Emitter.off("conversation-start");
            Emitter.off("conversation_not_attended_new");
            Emitter.off("conversation_not_attended_update");
            Emitter.off("conversation_new_ticket");
            Emitter.off("conversation_update_ticket");
        };
    }, []);

    const getTotalInQueueCases = async () => {
        try {
            const { data: response } = await JelouApiV1.get(`/company/${company.id}/tickets`, {
                params: {
                    limit: queueRow,
                    page: 0,
                    state: "in_queue",
                    type: "chat",
                    ...(!isEmpty(userScopes) ? { teams: userScopes } : {}),
                },
                paramsSerializer: function (params) {
                    return qs.stringify(params);
                },
            });

            const { data = {} } = response;
            const { pagination = null } = data;
            if (pagination) {
                setTotalQueueResults(pagination?.total);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const queueConversationsUpdate = (conversation) => {
        const eventId = get(conversation, "_id", "");
        // const totalQueueResults = totalQueueResultsRef.current;

        try {
            const queueConversations = queueCasesRef.current;

            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const conversationFiltered = get(payloadEvent, "company.id", 0) === company.id;
                if (conversationFiltered) {
                    if (toUpper(payloadEvent.state) === "ASSIGNED" || toUpper(payloadEvent.state) === "EXPIRED") {
                        // if (totalQueueResults > 0) {
                        //     setTotalQueueResults(totalQueueResults - 1);
                        // }
                        getTotalInQueueCases();
                        const newQueue = queueConversations.filter((item) => item.roomId !== payloadEvent.roomId);
                        setQueueCases(newQueue);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const addNewToQueue = (conversation) => {
        const eventId = get(conversation, "_id", "");
        const totalQueueResults = totalQueueResultsRef.current;

        try {
            const queueConversations = queueCasesRef.current;
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const ticketType = get(payloadEvent, "type", "");
                if (ticketType !== "chat") return;

                const conversationFiltered = get(payloadEvent, "company.id", 0) === company.id;
                if (conversationFiltered) {
                    setTotalQueueResults(totalQueueResults + 1);
                    setQueueCases(mergeById(queueConversations, payloadEvent, "_id"));
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const addNewToRecover = (conversation) => {
        const conversationsToRecover = recoverCasesRef.current;
        const eventId = get(conversation, "_id", "");
        const teamSelected = teamSelectedRef.current;
        const userScopes = userScopesRef.current;

        // const totalRecoverResults = totalRecoverResultsRef.current;

        try {
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const caseBelongsToTeam = get(payloadEvent, "team.id", 0) === teamSelected.id;
                const caseInScope = includes(userScopes, get(payloadEvent, "team.id", 0));

                if (payloadEvent.status === "NOT_ASSIGNED" && !isEmpty(teamSelected) && caseBelongsToTeam) {
                    const parentConversation = conversationsToRecover.find((conver) => get(conver, "client.id") === get(payloadEvent, "client.id"));
                    if (!isEmpty(parentConversation)) {
                        let subRows = get(parentConversation, "subRows", []);
                        if (parentConversation.subRows) {
                            subRows.push(conversation);
                        }
                        setRecoverCases(mergeById(conversationsToRecover, parentConversation));
                    } else {
                        let firstRow = payloadEvent;
                        firstRow = { ...payloadEvent, isParent: true, subRows: [] };
                        firstRow.id = firstRow.client.id;
                        setRecoverCases(mergeById(conversationsToRecover, firstRow));
                    }
                } else if (payloadEvent.status === "NOT_ASSIGNED" && isEmpty(teamSelected)) {
                    if (!isEmpty(userScopes) && caseInScope) {
                        const parentConversation = conversationsToRecover.find(
                            (conver) => get(conver, "client.id") === get(payloadEvent, "client.id")
                        );
                        if (!isEmpty(parentConversation)) {
                            let subRows = get(parentConversation, "subRows", []);
                            if (parentConversation.subRows) {
                                subRows.push(payloadEvent);
                            }

                            setRecoverCases(mergeById(conversationsToRecover, parentConversation));
                        } else {
                            let firstRow = payloadEvent;
                            firstRow = { ...payloadEvent, isParent: true, subRows: [] };
                            firstRow.id = firstRow.client.id;
                            setRecoverCases(mergeById(conversationsToRecover, firstRow));
                        }
                    }
                    if (isEmpty(userScopes)) {
                        const parentConversation = conversationsToRecover.find(
                            (conver) => get(conver, "client.id") === get(payloadEvent, "client.id")
                        );
                        if (!isEmpty(parentConversation)) {
                            let subRows = get(parentConversation, "subRows", []);
                            if (parentConversation.subRows) {
                                subRows.push(payloadEvent);
                            }

                            setRecoverCases(mergeById(conversationsToRecover, parentConversation));
                        } else {
                            let firstRow = payloadEvent;
                            firstRow = { ...payloadEvent, isParent: true, subRows: [] };
                            firstRow.id = firstRow.client.id;
                            setRecoverCases(mergeById(conversationsToRecover, firstRow));
                        }
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const conversationNotAttendedUpdate = (conversation) => {
        const eventId = get(conversation, "_id", "");
        const conversationsToRecover = recoverCasesRef.current;
        try {
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const conversationFiltered = get(payloadEvent, "company.id", 0) === company.id;

                if (conversationFiltered) {
                    if (toUpper(payloadEvent.status) === "ASSIGNED" || toUpper(payloadEvent.status) === "EXPIRED") {
                        const conversationsFiltered = conversationsToRecover.filter((conversation) => {
                            return get(conversation, "client.id", "") !== get(payloadEvent, "client.id", "");
                        });

                        setRecoverCases(conversationsFiltered);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!isEmpty(company)) {
            getDailyStats();
        }
    }, [company, userScopes, filtersKia, cleanFilters]);

    useEffect(() => {
        if (!isEmpty(totalsByTeam)) {
            if (!hasDifMetrics) {
                let totalsTotals = [];
                let totalsActual = [];
                let totalsActualNotReplied = [];
                let totalsAttended = [];
                let totalsTransfered = [];
                let totalsNotAttended = [];
                let totalsAvgReplyTime = [];
                let totalsAvgOperatorResponseTime = [];
                let totalsAvgConversationTime = [];
                let totalsByRecovery = [];

                let totals,
                    actuals,
                    actualsNotReplied,
                    attendeds,
                    transfereds,
                    notAttendeds,
                    avgReplyTimes,
                    avgOperatorResponseTimes,
                    avgConversationTimes,
                    byRecoveryReduced;

                totalsByTeam.forEach((object) => {
                    let {
                        total,
                        actual,
                        actualNotReplied,
                        attended,
                        transfered,
                        notAttended,
                        avgReplyTime,
                        avgOperatorResponseTime,
                        avgConversationTime,
                        byRecovery,
                    } = object;

                    totalsByRecovery.push(byRecovery);
                    totalsTotals.push(total);
                    totalsActual.push(actual);
                    totalsActualNotReplied.push(actualNotReplied);
                    totalsAttended.push(attended);
                    totalsTransfered.push(transfered);
                    totalsNotAttended.push(notAttended);
                    totalsAvgReplyTime.push(avgReplyTime);
                    totalsAvgOperatorResponseTime.push(avgOperatorResponseTime);
                    totalsAvgConversationTime.push(avgConversationTime);

                    byRecoveryReduced = totalsByRecovery.reduce((a, b) => a + b, 0);
                    totals = totalsTotals.reduce((a, b) => a + b, 0);
                    actuals = totalsActual.reduce((a, b) => a + b, 0);
                    actualsNotReplied = totalsActualNotReplied.reduce((a, b) => a + b, 0);
                    attendeds = totalsAttended.reduce((a, b) => a + b, 0);
                    transfereds = totalsTransfered.reduce((a, b) => a + b, 0);
                    notAttendeds = totalsNotAttended.reduce((a, b) => a + b, 0);
                    avgReplyTimes = totalsAvgReplyTime.reduce((a, b) => a + b, 0);
                    avgOperatorResponseTimes = totalsAvgOperatorResponseTime.reduce((a, b) => a + b, 0);
                    avgConversationTimes = totalsAvgConversationTime.reduce((a, b) => a + b, 0);
                });
                const avgReply = (avgReplyTimes / totalsByTeam.length) * 1000;
                const avgOpReply = (avgOperatorResponseTimes / totalsByTeam.length) * 1000;
                const opConversation = (avgConversationTimes / totalsByTeam.length) * 1000;
                setTotalConversations(totals);
                setAverageReply(msToHMS(avgReply));
                setAvgOperatorReply(msToHMS(avgOpReply));
                setActualConversation(actuals);
                setActualConversationNotReplied(actualsNotReplied);
                setAttendedConversation(attendeds);
                setTransferedConversation(transfereds);
                setNotAttendedConversation(notAttendeds);
                setAvgConversationTime(msToHMS(opConversation));
                if (!isNaN(byRecoveryReduced)) {
                    setTotalRecoverResults(byRecoveryReduced);
                }
            } else {
                let totalsTotals = [];
                let totalsActual = [];
                let totalsAttended = [];
                let totalsTransfered = [];
                let totalsNotAttended = [];
                let totalsAvgReplyTime = [];
                let totalsAvgOperatorResponseTime = [];
                let totalsAvgConversationTime = [];
                let totalsByRecovery = [];

                let totals,
                    actuals,
                    attendeds,
                    transfereds,
                    notAttendeds,
                    avgReplyTimes,
                    avgOperatorResponseTimes,
                    avgConversationTimes,
                    byRecoveryReduced;

                totalsByTeam.forEach((object) => {
                    let {
                        realTotal,
                        attended,
                        actual,
                        actualReplied,
                        transfered,
                        notAttended,
                        actualNotReplied,
                        avgReplyTime,
                        avgOperatorResponseTime,
                        avgConversationTime,
                        byRecovery,
                    } = object;
                    totalsByRecovery.push(byRecovery);
                    totalsTotals.push(realTotal);
                    totalsActual.push(actual);
                    totalsAttended.push(attended + actualReplied);
                    totalsTransfered.push(transfered);
                    totalsNotAttended.push(notAttended + actualNotReplied);
                    totalsAvgReplyTime.push(avgReplyTime);
                    totalsAvgOperatorResponseTime.push(avgOperatorResponseTime);
                    totalsAvgConversationTime.push(avgConversationTime);
                    byRecoveryReduced = totalsByRecovery.reduce((a, b) => a + b, 0);
                    totals = totalsTotals.reduce((a, b) => a + b, 0);
                    actuals = totalsActual.reduce((a, b) => a + b, 0);
                    attendeds = totalsAttended.reduce((a, b) => a + b, 0);
                    transfereds = totalsTransfered.reduce((a, b) => a + b, 0);
                    notAttendeds = totalsNotAttended.reduce((a, b) => a + b, 0);
                    avgReplyTimes = totalsAvgReplyTime.reduce((a, b) => a + b, 0);
                    avgOperatorResponseTimes = totalsAvgOperatorResponseTime.reduce((a, b) => a + b, 0);
                    avgConversationTimes = totalsAvgConversationTime.reduce((a, b) => a + b, 0);
                });

                const avgReply = avgReplyTimes / totalsByTeam.length;
                const avgOpReply = avgOperatorResponseTimes / totalsByTeam.length;
                const opConversation = avgConversationTimes / totalsByTeam.length;

                if (!isNaN(byRecoveryReduced)) {
                    setTotalRecoverResults(byRecoveryReduced);
                }
                setTotalConversations(totals);
                setAttendedConversation(attendeds);
                setAverageReply(secondsToMinutesAndSeconds(avgReply));
                setAvgOperatorReply(secondsToMinutesAndSeconds(avgOpReply));
                setActualConversation(actuals);
                setTransferedConversation(transfereds);
                setNotAttendedConversation(notAttendeds);
                setAvgConversationTime(secondsToMinutesAndSeconds(opConversation));
            }
        } else {
            setTotalConversations(0);
            setActualConversation(0);
            setActualConversationNotReplied(0);
            setAttendedConversation(0);
            setTransferedConversation(0);
            setNotAttendedConversation(0);
            setAverageReply("00m 00s");
            setAvgOperatorReply("00m 00s");
            setAvgConversationTime("00m 00s");
            setTotalRecoverResults(0);
        }
    }, [totalsByTeam]);

    useEffect(() => {
        if (!isEmpty(company)) {
            getActiveConversations();
        }
    }, [company, cleanFilters, filtersKia, userScopes, actualPage, actualRow]);

    useEffect(() => {
        if (!isEmpty(company)) {
            getRecoverCases();
        }
    }, [company, recoverPage, recoverRow, selectedReason, userScopes]);

    useEffect(() => {
        if (!isEmpty(company)) {
            getInQueueCases();
        }
    }, [company, queuePage, queueRow, userScopes]);

    useEffect(() => {
        if (!isEmpty(extraRow) && ifKia) {
            let arr = [];
            let colu = [];
            extraRow = extraRow.toString().split(",");
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

    const updateTotalsConverations = (conversation) => {
        const eventId = get(conversation, "_id", "");
        const userScopes = userScopesRef.current;
        try {
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});

                const { totalsByTeam, inQueueByTeams = [], inQueue } = payloadEvent;

                if (isEmpty(userScopes)) {
                    totalsByTeam.forEach((total) => {
                        total.id = total._id;
                    });
                    setTotalsByTeam(totalsByTeam);
                    setTotalQueueResults(inQueue);
                } else {
                    totalsByTeam.forEach((total) => {
                        total.id = total._id;
                    });

                    let teamOnScope = [];
                    let queueOnScope = [];

                    for (let i = 0; i < userScopes.length; i++) {
                        let team = totalsByTeam.find((team) => team._id === userScopes[i]);
                        let queue = inQueueByTeams.find((team) => Number(team._id) === userScopes[i]);

                        if (!isEmpty(team)) {
                            teamOnScope.push(team);
                        }
                        if (!isEmpty(queue)) {
                            queueOnScope.push(queue);
                        }
                    }

                    if (!isEmpty(queueOnScope)) {
                        const totalQueue = queueOnScope.reduce((acc, cur) => acc + cur.total, 0);
                        setTotalQueueResults(totalQueue);
                    }

                    setTotalsByTeam(teamOnScope);
                }
            });
        } catch (error) {
            console.log("error ", error);
        }
    };

    const getDailyStats = async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Cancelling");
        }
        try {
            const source = axios.CancelToken.source();
            setCancelToken(source);

            if (!isEmpty(company)) {
                setLoading(true);
                const { data } = await JelouApiV1.get(`company/${company.id}/conversations`, {
                    params: {
                        page: 1,
                        limit: 10,
                        ...(!isEmpty(userScopes) ? { teams: userScopes } : {}),
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
                    totalsByTeam.forEach((total) => {
                        total.id = total._id;
                    });
                    setTotalsByTeam(totalsByTeam);
                } else {
                    setTotalsByTeam(totalsByTeam);
                }
                setLoading(false);
            }
        } catch (error) {
            if (toUpper(error.message) === "CANCELLING") {
                setLoading(true);
            } else {
                setLoading(false);
                console.log("error ", error);
            }
        }
    };

    //ACTUAL TABLE

    const showFirstView = () => {
        setShowActualTable(true);
        setShowInQueueTable(false);
        setShowRecoverTable(false);
    };

    const getActiveConversations = async () => {
        try {
            setLoadingActualTable(true);
            const { data } = await JelouApiV1.get(`company/${company.id}/conversations`, {
                params: {
                    page: actualPage,
                    limit: actualRow,
                    shouldPaginate: false,
                    event: "active",
                    ...(!isEmpty(userScopes) ? { teams: userScopes } : {}),
                    // ...(!isEmpty(filteredOperator) ? { operatorId: filteredOperator.id } : {}),
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
            });
            let { results, pagination } = data;
            if (!isEmpty(results)) {
                results.forEach((result) => {
                    result.id = result._id;
                });
            }
            setLoadingActualTable(false);
            setTotalActualPage(pagination.totalPages);
            let actualConversations = results.filter((convesations) => convesations.status === "ACTIVE");
            setActualCases(actualConversations);
            // dispatch(setGeneralConversations(filteredConversation));
        } catch (error) {
            console.log("error ", error);
        }
    };

    const startConversation = (conversation) => {
        const eventId = get(conversation, "_id", "");
        try {
            const actualCases = actualCasesRef.current;
            const operators = operatorsRef.current;
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const conversationFiltered = filterByKey(operators, "id", payloadEvent.operator.id);
                if (!isEmpty(conversationFiltered)) {
                    setActualCases(mergeById(actualCases, payloadEvent, "roomId"));
                }
            });
        } catch (error) {
            console.log("error ", error);
        }
    };

    const updateConversationFirstResponse = async (conversation) => {
        const eventId = get(conversation, "_id", "");
        const actualCases = actualCasesRef.current;
        try {
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});

                const conversationFiltered = first(filterByKey(actualCases, "_id", payloadEvent._id));
                if (!isEmpty(conversationFiltered)) {
                    let conv = merge({ ...conversationFiltered }, payloadEvent);
                    setActualCases(mergeById(actualCases, conv));
                }
            });
        } catch (error) {
            console.log("error ", error);
        }
    };

    const deleteConversation = async (conversation) => {
        const eventId = get(conversation, "_id", "");
        const actualCases = actualCasesRef.current;
        try {
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const roomId = payloadEvent._id;
                setActualCases(deleteById(actualCases, roomId, "_id"));
            });
        } catch (error) {
            console.log("error ", error);
        }
    };

    //RECOVER TABLE

    const showSencondView = () => {
        setShowActualTable(false);
        setShowRecoverTable(true);
        setShowInQueueTable(false);
    };
    const getRecoverCases = async () => {
        try {
            setLoadingRecoverTable(true);
            const { data } = await JelouApiV1.get(`/companies/${company.id}/conversationsNotAttended/get_conversations`, {
                params: {
                    page: recoverPage,
                    limit: recoverRow,
                    ...(!isEmpty(userScopes) ? { teams: userScopes } : {}),
                    ...(!isEmpty(selectedReason) ? { reason: selectedReason.id } : {}),
                },
            });
            setLoadingRecoverTable(false);
            const results = get(data, "data.results", []);
            let finalArr = [];

            if (!isEmpty(results)) {
                results.forEach((result) => {
                    let data = result.data;
                    if (data.length > 1) {
                        if (ifKia) {
                            data = data.filter((item) => toUpper(item.status) !== "MANAGING");
                        }
                        data = sortBy(data, ["createdAt"]);
                        let subRows = [...data];
                        subRows.shift();
                        let firstRow = first(data);
                        firstRow = { ...first(data), subRows: subRows, isParent: true };
                        firstRow.id = firstRow.client.id;
                        finalArr.push(firstRow);
                    } else {
                        let firstRow = first(data);
                        if (ifKia && toUpper(firstRow.status) === "MANAGING") {
                            return;
                        }
                        firstRow = { ...first(data), isParent: true };
                        firstRow.id = firstRow.client.id;
                        finalArr.push(firstRow);
                    }
                });
            }
            setTotalRecoverPage(Math.ceil(data.data.pagination.total / data.data.pagination.limit));
            setTotalRecoverResults(get(data, "data.pagination.total", 0));
            setRecoverCases(finalArr);
        } catch (error) {
            setLoadingRecoverTable(false);
            console.log("error", error);
        }
    };

    // IN QUEUE TABLE

    const showThirdView = () => {
        setShowActualTable(false);
        setShowRecoverTable(false);
        setShowInQueueTable(true);
    };

    const getInQueueCases = async () => {
        setLoadingQueueTable(true);
        try {
            const { data: response } = await JelouApiV1.get(`/company/${company.id}/tickets`, {
                params: {
                    limit: queueRow,
                    page: queuePage,
                    state: "in_queue",
                    type: "chat",
                    ...(!isEmpty(userScopes) ? { teams: userScopes } : {}),
                },
                paramsSerializer: function (params) {
                    return qs.stringify(params);
                },
            });
            const totalTickets = get(response, "data.pagination.total", 0);
            const pagesTemp = Math.ceil(totalTickets / queueRow);
            const results = get(response, "data.results", []);
            const maxPageTemp = pagesTemp === 0 ? pagesTemp + 1 : pagesTemp;
            setTotalQueueResults(totalTickets);
            setTotalQueuePage(maxPageTemp);
            setLoadingQueueTable(false);

            setQueueCases(orderBy(results, ["createdAt"], ["asc"]));
        } catch (error) {
            setLoadingQueueTable(false);
            console.log(error);
        }
    };

    const cleanKIAFilters = () => {
        setFilteredCategory("");
        setFilteredAgencies("");
        setFilteredGroups("");
        setFilteredCities("");
        setCleanFilters(true);
    };

    const applyKIAFilters = () => {
        const id = uuid();
        setFiltersKia(id);
        setCleanFilters(false);
    };

    return (
        <>
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
                    getOperators={getOperators}
                    cleanFilters={cleanKIAFilters}
                    applySearch={applyKIAFilters}
                />
            )}
            <Stats
                ifKia={ifKia}
                loading={loading}
                averageReply={averageReply}
                avgOperatorReply={avgOperatorReply}
                totalConversations={totalConversations}
                actualConversation={actualConversation}
                avgConversationTime={avgConversationTime}
                attendedConversation={attendedConversation}
                transferedConversation={transferedConversation}
                notAttendedConversation={notAttendedConversation}
                actualConversationNotReplied={actualConversationNotReplied}
            />

            <div className="mb-4 w-full overflow-hidden rounded-1 bg-white shadow-card">
                <p className="px-5 pt-4 text-xl font-bold text-gray-400">{t("monitoring.Casos")}</p>
                <Tabs
                    marked1={showActualTable}
                    marked2={showRecoverTable}
                    marked3={showInQueueTable}
                    title1={t("monitoring.Actuales")}
                    title2={t("monitoring.Por recuperar")}
                    title3={hasQueue && t("monitoring.En cola")}
                    title1Number={actualConversation}
                    title2Number={totalRecoverResults}
                    title3Number={totalQueueResults}
                    showFirstTab={showFirstView}
                    showSecondTab={showSencondView}
                    showThirdTab={showThirdView}
                    backgroundColor="#fff"
                    borderBottomLeftRadius="1rem"
                    borderBottomRightRadius="1rem"
                />
                {showActualTable && (
                    <ActualCasesTable
                        colum={colum}
                        row={actualRow}
                        setRows={setActualRow}
                        actualPage={actualPage}
                        customRows={customRows}
                        maxPage={totalActualPage}
                        data={orderBy(actualCases, ["createdAt"], ["desc"])}
                        loading={loadingActualTable}
                        setActualPage={setActualPage}
                        setMaxPage={setTotalActualPage}
                        totalResults={actualConversation}
                        noDataMessage={t("No existen casos actuales")}
                        ifKia={ifKia}
                        teamOptions={teamOptions}
                        setActualCases={setActualCases}
                    />
                )}
                {showRecoverTable && (
                    <RecoverCasesTable
                        row={recoverRow}
                        data={recoverCases}
                        setRows={setRecoverRow}
                        actualPage={recoverPage}
                        maxPage={totalRecoverlPage}
                        loading={loadingRecoverTable}
                        setActualPage={setRecoverPage}
                        selectedReason={selectedReason}
                        setMaxPage={setTotalRecoverPage}
                        totalResults={totalRecoverResults}
                        setSelectedReason={setSelectedReason}
                        setRecoverCases={setRecoverCases}
                        teamOptions={teamOptions}
                    />
                )}
                {showInQueueTable && hasQueue && (
                    <QueueCasesTable
                        row={queueRow}
                        data={queueCases}
                        setRows={setQueueRow}
                        actualPage={queuePage}
                        maxPage={totalQueuelPage}
                        loading={loadingQueueTable}
                        setActualPage={setQueuePage}
                        selectedReason={selectedReason}
                        setMaxPage={setTotalQueuePage}
                        totalResults={totalQueueResults}
                        setSelectedReason={setSelectedReason}
                        teamOptions={teamOptions}
                        setQueueCases={setQueueCases}
                    />
                )}
            </div>
        </>
    );
}
export default LiveChats;
