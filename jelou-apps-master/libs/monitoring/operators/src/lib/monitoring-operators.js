import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import { OperatorsFilters, OperatorsTable, KIAFilters } from "@apps/monitoring/ui-shared";
import { memo, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Operator } from "@apps/monitoring/operators/operator";
import { JelouApiV1, Emitter } from "@apps/shared/modules";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

const MemoOperatorsFilters = memo(OperatorsFilters);

const MonitoringOperators = (props) => {
    const {
        isLoadingOperators,
        company,
        teams,
        operatorParams,
        setOperatorParams,
        dataOperators = [],
        botEmail,
        teamOptions,
        // KIA
        ifKia,
        filteredCategory,
        setFilteredCategory,
        filteredAgencies,
        setFilteredAgencies,
        filteredGroups,
        setFilteredGroups,
        filteredCities,
        setFilteredCities,
        // cleanFilters,
        // setCleanFilters,
        // filtersKia,
        setFiltersKia,
    } = props;

    const userScopes = useSelector((state) => state.teamScopes);
    const { subsection = "" } = useParams();
    const queryClient = useQueryClient();

    // Operators table
    const [operators, setOperators] = useState([]);
    const [pageLimit, setPageLimit] = useState(1);
    const [nrows, setRows] = useState(10);
    const [maxPage, setMaxPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    // Operators filters
    const [status, setStatus] = useState({});
    const [team, setTeam] = useState({});
    const [query, setQuery] = useState("");
    const [loadingImpersonate, setLoadingImpersonate] = useState();
    const statusRef = useRef(status);
    statusRef.current = status;

    useEffect(() => {
        Emitter.on("conversation-totals", (payload) => {
            if (isEmpty(payload)) return;
            const eventId = payload._id;
            try {
                JelouApiV1.get(`/real-time-events/${eventId}`).then((data) => {
                    const total = get(data, "data.data.payload", {});
                    updateOperatorCaseStats(total);
                    Emitter.emit("conversation-totals-operator", total);
                });
            } catch (error) {
                console.log(error);
            }
        });
        Emitter.on("support-tickets-totals", (payload) => {
            if (!isEmpty(payload)) updateOperatorEmailStats(payload);
        });
        Emitter.on("operator-login", (payload) => {
            if (!isEmpty(payload)) operatorLogIn(payload);
        });
        Emitter.on("operator-logout", (payload) => {
            if (!isEmpty(payload)) operatorLogOut(payload);
        });
        Emitter.on("operator-status-update", (payload) => {
            if (!isEmpty(payload)) operatorStatusUpdate(payload);
        });
        return () => {
            if (has(operatorParams, "query")) {
                setOperatorParams({ ...operatorParams, query: "" });
            }
            Emitter.off("conversation-totals");
            Emitter.off("support-tickets-totals");
            Emitter.off("operator-login");
            Emitter.off("operator-logout");
            Emitter.off("operator-status-update");
        };
    }, []);

    useEffect(() => {
        setOperators(get(dataOperators, "results", []));
        setTotalResults(get(dataOperators, "pagination.total", 0));
        setMaxPage(get(dataOperators, "pagination.totalPages", 1));
    }, [dataOperators]);

    useEffect(() => {
        setOperatorParams({ ...operatorParams, page: pageLimit, limit: nrows });
    }, [pageLimit, nrows]);

    const validateFilter = (payloadEvent, results, operatorId, oldDataOperator) => {
        //verify if filtered status matches the operator payload status
        if (!isEmpty(statusRef?.current) && payloadEvent?.status !== statusRef.current?.value) {
            const filterOperator = results.filter((user) => get(user, "Operator.id") !== operatorId);
            operators.current = filterOperator;
            setTotalResults(filterOperator.length);

            return { ...oldDataOperator, results: filterOperator };
        }
    };

    const updateOperatorCaseStats = (total) => {
        const { totalsOperators } = total;
        if (!isEmpty(totalsOperators)) {
            queryClient.setQueriesData(["getOperatorsTable"], (oldDataOperator) => {
                const results = get(oldDataOperator, "results", []);
                const update = (user) => {
                    const operatorId = get(user, "Operator.id");
                    const totalsByOperator = totalsOperators.find((total) => get(total, "_id") === operatorId);
                    const prevActual = get(user, "casesStats.chats.actual", 0);
                    const prevActualReplied = get(user, "casesStats.chats.pendings", 0);
                    const prevTotal = get(user, "casesStats.chats.total", 0);
                    return !isEmpty(totalsByOperator)
                        ? {
                              ...user,
                              casesStats: {
                                  ...user.casesStats,
                                  chats: {
                                      ...user.casesStats.chats,
                                      actual: get(totalsByOperator, "actual", prevActual),
                                      pendings: get(totalsByOperator, "actualNotReplied", prevActualReplied),
                                      total: get(totalsByOperator, "total", prevTotal),
                                  },
                              },
                          }
                        : user;
                };

                const _results = results.map(update);
                operators.current = _results;
                if (!isLoadingOperators) return { ...oldDataOperator, results: _results };
            });
        }
    };

    const updateOperatorEmailStats = (payload) => {
        const { totalsByOperator } = payload;
        if (!isEmpty(totalsByOperator)) {
            queryClient.setQueriesData(["getOperatorsTable"], (oldDataOperator) => {
                const results = get(oldDataOperator, "results", []);
                const update = (user) => {
                    const operatorId = get(user, "Operator.id");
                    const totalsOperator = totalsByOperator.find((total) => get(total, "_id") === operatorId);
                    const prevActualReplied = get(user, "casesStats.tickets.pendings", 0);
                    const prevTotal = get(user, "casesStats.tickets.total", 0);
                    const actual = get(totalsOperator, "Total", prevTotal) - get(totalsOperator, "Closed", prevActualReplied);
                    return !isEmpty(totalsOperator)
                        ? {
                              ...user,
                              casesStats: {
                                  ...user.casesStats,
                                  tickets: {
                                      ...user.casesStats.tickets,
                                      actual: actual,
                                      pendings: get(totalsOperator, "Pending", prevActualReplied),
                                      total: get(totalsOperator, "Total", prevTotal),
                                  },
                              },
                          }
                        : user;
                };

                const _results = results.map(update);
                setOperators(_results);
                if (!isLoadingOperators) return { ...oldDataOperator, results: _results };
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

                queryClient.setQueriesData(["getOperatorsTable"], (oldDataOperator) => {
                    const results = get(oldDataOperator, "results", []);
                    if (!isEmpty(statusRef.current)) {
                        return validateFilter(payloadEvent, results, operatorId, oldDataOperator);
                    }
                    const update = (user) => {
                        return get(user, "Operator.id") === operatorId
                            ? { ...user, Operator: { ...user.Operator, loggedInAt, status }, operatorActive: status }
                            : user;
                    };
                    const _results = results.map(update);
                    setOperators(_results);
                    if (!isLoadingOperators) return { ...oldDataOperator, results: _results };
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

                queryClient.setQueriesData(["getOperatorsTable"], (oldDataOperator) => {
                    const results = get(oldDataOperator, "results", []);
                    if (!isEmpty(statusRef.current)) {
                        return validateFilter(payloadEvent, results, operatorId, oldDataOperator);
                    }
                    const update = (user) => {
                        return get(user, "Operator.id") === operatorId
                            ? { ...user, Operator: { ...user.Operator, loggedOutAt, status }, operatorActive: status }
                            : user;
                    };
                    const _results = results.map(update);
                    setOperators(_results);
                    if (!isLoadingOperators) return { ...oldDataOperator, results: _results };
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

                queryClient.setQueriesData(["getOperatorsTable"], (oldDataOperator) => {
                    const results = get(oldDataOperator, "results", []);
                    if (!isEmpty(statusRef.current)) {
                        return validateFilter(payloadEvent, results, operatorId, oldDataOperator);
                    }
                    const update = (user) => {
                        return get(user, "Operator.id") === operatorId
                            ? { ...user, Operator: { ...user.Operator, status }, operatorActive: status }
                            : user;
                    };
                    const _results = results.map(update);
                    setOperators(_results);
                    if (!isLoadingOperators) return { ...oldDataOperator, results: _results };
                });
            });
        } catch (err) {
            console.log(err);
        }
    };

    const openImpersonate = (e, operator = { id: subsection }) => {
        const hasOpertor = has(operator, "Operator.id");
        const id = hasOpertor ? get(operator, "Operator.id", "") : get(operator, "id", subsection);
        setLoadingImpersonate(id);

        JelouApiV1.post(`/operators/${id}/impersonate`)
            .then(({ data }) => {
                const { token } = data;
                const url = window.location.origin;
                const website = `${url}/pma/chats`;

                const authOperatorMaster = localStorage.getItem("jwt");
                const jwtOperatorExists = !!localStorage.getItem("jwt-operator");
                if (!jwtOperatorExists) {
                    localStorage.setItem("jwt-operator", authOperatorMaster);
                }

                localStorage.setItem("jwt", token);
                window.location.replace(website);

                setLoadingImpersonate("");
            })
            .catch((err) => {
                console.log("Error", err);
                setLoadingImpersonate("");
            });

        e?.preventDefault();
        e?.stopPropagation();
        e?.nativeEvent.stopImmediatePropagation();
    };

    if (subsection) {
        return (
            <div className="my-4 h-full">
                <Operator
                    openImpersonate={openImpersonate}
                    botEmail={botEmail}
                    teamOptions={teamOptions}
                    operators={operators}
                    loadingImpersonate={loadingImpersonate}
                />
            </div>
        );
    }

    const cleanKIAFilters = () => {
        setFilteredCategory({});
        setFilteredAgencies({});
        setFilteredGroups({});
        setFilteredCities({});
    };

    const applyKIAFilters = () => {
        const id = uuid();
        setFiltersKia(id);
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
                    cleanFilters={cleanKIAFilters}
                    applySearch={applyKIAFilters}
                />
            )}
            <div className="my-4 max-h-full rounded-xl bg-white">
                <MemoOperatorsFilters
                    status={status}
                    operatorParams={operatorParams}
                    setOperatorParams={setOperatorParams}
                    team={team}
                    teamOptions={teams}
                    company={company}
                    setStatus={setStatus}
                    setTeam={setTeam}
                    query={query}
                    setQuery={setQuery}
                    setPageLimit={setPageLimit}
                />
                <OperatorsTable
                    data={operators}
                    pageLimit={pageLimit}
                    setPageLimit={setPageLimit}
                    maxPage={maxPage}
                    nrows={nrows}
                    setRows={setRows}
                    totalResults={totalResults}
                    isLoadingOperators={isLoadingOperators}
                    openImpersonate={openImpersonate}
                    loadingImpersonate={loadingImpersonate}
                />
            </div>
        </>
    );
};
export default MonitoringOperators;
