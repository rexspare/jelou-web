import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import first from "lodash/first";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

import Stats from "./stats/stats";
import { DashboardServer, JelouApiV1, Emitter } from "@apps/shared/modules";
import { msToHMS } from "@apps/shared/utils";
import { mergeById } from "@apps/shared/utils";
import dayjs from "dayjs";
import { SupportTicketsMenu, SupportTicketsTable } from "libs/monitoring/live/tickets/components/src";

export function MonitoringTickets(props) {
    const { t } = useTranslation();
    const company = useSelector((state) => state.company);
    const userScopes = useSelector((state) => state.teamScopes);

    const { teamOptions, botEmail, operatorOptions, teamSelected } = props;

    const [totalEmails, setTotalEmails] = useState(0);
    const [newEmails, setNewEmails] = useState(0);
    const [openEmails, setOpenEmails] = useState(0);
    const [closedEmails, setClosedEmails] = useState(0);
    const [pendingEmails, setPendingEmails] = useState(0);
    const [solvedEmails, setSolvedEmails] = useState(0);
    const [drafts, setDrafts] = useState(0);
    const [notAssignedEmails, setNotAssignedEmails] = useState(0);
    const [toExpireEmails, setToExpireEmails] = useState(0);
    const [rowsPageNumber, setRowsPageNumber] = useState(10);
    const [totalsByTeam, setTotalsByTeam] = useState([]);
    const [statsByTeam, setStatsByTeam] = useState([]);
    const [currentTab, setCurrentTab] = useState("all");

    const [loading, setLoading] = useState(false);

    const [firstResponseTime, setFirstResponseTime] = useState("00h 00m 00s");
    const [solutionTime, setSolutionTime] = useState("00h 00m 00s");

    const [emailsIsLoading, setEmailsIsLoading] = useState(false);
    const [emailsStatus, setEmailsStatus] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [maxPageNumber, setMaxPageNumber] = useState(1);
    const [ticketsTableData, setTicketsTableData] = useState([]);

    const userScopesRef = useRef(userScopes);
    userScopesRef.current = userScopes;

    const allEmailsRef = useRef(ticketsTableData);
    allEmailsRef.current = ticketsTableData;
    const currentEmailTabRef = useRef(currentTab);
    currentEmailTabRef.current = currentTab;
    const teamSelectedRef = useRef(teamSelected);
    teamSelectedRef.current = teamSelected;

    const companyRef = useRef(company);
    companyRef.current = company;

    useEffect(() => {
        if (!isEmpty(company)) {
            getEmailTotals();
            getEmailStats();
        }
    }, [company, pageNumber, teamSelected, rowsPageNumber]);

    useEffect(() => {
        if (!isEmpty(company)) {
            getEmailsInfo();
        }
    }, [company, emailsStatus, pageNumber, teamSelected, rowsPageNumber]);

    useEffect(() => {
        if (!isEmpty(company)) {
            getNotAssignedTotals();
        }
    }, [company]);

    useEffect(() => {
        if (!isEmpty(totalsByTeam)) {
            let totalsClosed = [];
            let totalsNew = [];
            let totalsNotAssigned = [];
            let totalsOpen = [];
            let totalsPending = [];
            let totalsSolved = [];
            let totalsTotals = [];
            let totalsToExpire = [];
            let totalsDrafts = [];
            let closed,
                newE,
                // notAssigned,
                open,
                pending,
                solved,
                drafts,
                totals;
            totalsByTeam.forEach((object) => {
                let { Closed, New, NotAssigned, Open, Pending, Resolved, ToExpire, Total, Draft } = object;
                totalsClosed.push(Closed);
                totalsNew.push(New);
                totalsNotAssigned.push(NotAssigned);
                totalsOpen.push(Open);
                totalsPending.push(Pending);
                totalsSolved.push(Resolved);
                totalsTotals.push(Total);
                totalsToExpire.push(ToExpire);
                totalsDrafts.push(Draft);

                closed = totalsClosed.reduce((a, b) => a + b, 0);
                newE = totalsNew.reduce((a, b) => a + b, 0);
                // notAssigned = totalsNotAssigned.reduce((a, b) => a + b, 0);
                open = totalsOpen.reduce((a, b) => a + b, 0);
                pending = totalsPending.reduce((a, b) => a + b, 0);
                solved = totalsSolved.reduce((a, b) => a + b, 0);
                totals = totalsTotals.reduce((a, b) => a + b, 0);
                drafts = totalsDrafts.reduce((a, b) => a + b, 0);
                // toExpire = totalsToExpire.reduce((a, b) => a + b, 0);
            });
            setClosedEmails(closed);
            setNewEmails(newE);
            // setNotAssignedEmails(notAssigned);
            setOpenEmails(open);
            setPendingEmails(pending);
            setSolvedEmails(solved);
            setDrafts(drafts);
            setTotalEmails(totals);
            // setToExpireEmails(get(data, "ToExpire", 0));
        } else {
            setClosedEmails(0);
            setNewEmails(0);
            // setNotAssignedEmails(0);
            setOpenEmails(0);
            setPendingEmails(0);
            setSolvedEmails(0);
            setTotalEmails(0);
            setDrafts(0);
            // setToExpireEmails(0);
        }
    }, [totalsByTeam]);

    useEffect(() => {
        if (!isEmpty(statsByTeam)) {
            let statsFirstResponseTimeAverage = [];
            let statsSolutionTimeAverage = [];
            let statsFirstResponseTimeAvg, statsSolutionTimeAvg;
            statsByTeam.forEach((object) => {
                if (object._id !== null) {
                    let { firstResponseTimeAverage, solutionTimeAverage } = object;

                    statsFirstResponseTimeAverage.push(firstResponseTimeAverage);
                    statsSolutionTimeAverage.push(solutionTimeAverage);

                    statsFirstResponseTimeAvg = statsFirstResponseTimeAverage.reduce((a, b) => a + b, 0);
                    statsSolutionTimeAvg = statsSolutionTimeAverage.reduce((a, b) => a + b, 0);
                }
            });
            setFirstResponseTime(msToHMS(statsFirstResponseTimeAvg));
            setSolutionTime(msToHMS(statsSolutionTimeAvg));
        } else {
            setFirstResponseTime("00h 00m 00s");
            setSolutionTime("00h 00m 00s");
        }
    }, [statsByTeam]);

    const addNewEmail = (email) => {
        const eventId = get(email, "_id", "");

        try {
            const currentEmailTab = currentEmailTabRef.current;
            const allEmails = allEmailsRef.current;
            const company = companyRef.current;
            const teamSelected = teamSelectedRef.current;
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const emailFiltered = get(payloadEvent, "company.id", 0) === company.id;
                if (emailFiltered) {
                    if (currentEmailTab === "all") {
                        if (isEmpty(teamSelected)) {
                            setTicketsTableData(mergeById(allEmails, payloadEvent, "_id"));
                        } else {
                            const emailBelongsToTeam = get(payloadEvent, "team.id", 0) === teamSelected.id;
                            if (emailBelongsToTeam) {
                                setTicketsTableData(mergeById(allEmails, payloadEvent, "_id"));
                            }
                        }
                    }
                    if (currentEmailTab !== "notAssigned" && currentEmailTab !== "all") {
                        if (isEmpty(teamSelected)) {
                            const mailsUpdated = mergeById(allEmails, payloadEvent, "_id");
                            const emailsByStatus = mailsUpdated.filter((email) => email.status === currentEmailTab);
                            setTicketsTableData(emailsByStatus);
                        } else {
                            const emailBelongsToTeam = get(payloadEvent, "team.id", 0) === teamSelected.id;
                            if (emailBelongsToTeam) {
                                const mailsUpdated = mergeById(allEmails, payloadEvent, "_id");
                                const emailsByStatus = mailsUpdated.filter((email) => email.status === currentEmailTab);
                                setTicketsTableData(emailsByStatus);
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.log("error ", error);
        }
    };

    const updateEmail = (email) => {
        const eventId = get(email, "_id", "");
        try {
            const currentEmailTab = currentEmailTabRef.current;
            const allEmails = allEmailsRef.current;
            const company = companyRef.current;
            const teamSelected = teamSelectedRef.current;
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});
                const emailFiltered = get(payloadEvent, "company.id", 0) === company.id;
                const emailBelongsToTeam = get(payloadEvent, "team.id", 0) === teamSelected.id;
                if (emailFiltered) {
                    if (currentEmailTab === "notAssigned") {
                        if (isEmpty(teamSelected)) {
                            const emailsFiltered = allEmails.filter((email) => email._id !== payloadEvent._id);
                            setTicketsTableData(emailsFiltered);
                        }
                    }

                    if (currentEmailTab === "all") {
                        if (isEmpty(teamSelected)) {
                            setTicketsTableData(mergeById(allEmails, payloadEvent, "_id"));
                        } else {
                            if (emailBelongsToTeam) {
                                setTicketsTableData(mergeById(allEmails, payloadEvent, "_id"));
                            }
                        }
                    }
                    if (currentEmailTab !== "notAssigned" && currentEmailTab !== "all") {
                        if (isEmpty(teamSelected)) {
                            const mailsUpdated = mergeById(allEmails, payloadEvent, "_id");
                            const emailsByStatus = mailsUpdated.filter((email) => email.status === currentEmailTab);
                            setTicketsTableData(emailsByStatus);
                        } else {
                            if (emailBelongsToTeam) {
                                const mailsUpdated = mergeById(allEmails, payloadEvent, "_id");
                                const emailsByStatus = mailsUpdated.filter((email) => email.status === currentEmailTab);
                                setTicketsTableData(emailsByStatus);
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.log("error ", error);
        }
    };

    const updateStatsEmails = (payload) => {
        const teamSelected = teamSelectedRef.current;
        if (isEmpty(teamSelected)) {
            setStatsByTeam(get(payload, "statsByTeam", []));
        } else {
            const statsByTeam = get(payload, "statsByTeam", []);
            const statsByTeamSelected = statsByTeam.filter((team) => team._id === teamSelected.id);
            setStatsByTeam(statsByTeamSelected);
        }
    };

    const updateTotalEmails = (payload) => {
        const teamSelected = teamSelectedRef.current;
        if (isEmpty(teamSelected)) {
            setTotalsByTeam(get(payload, "totalsByTeam", []));
        } else {
            const totalsByTeam = get(payload, "totalsByTeam", []);
            const totalsByTeamSelected = totalsByTeam.filter((team) => team._id === teamSelected.id);
            setTotalsByTeam(totalsByTeamSelected);
        }
    };

    useEffect(() => {
        if (!emailsIsLoading) {
            Emitter.on("support-tickets-totals", (payload) => {
                updateTotalEmails(payload);
            });

            Emitter.on("support-tickets-stats", (payload) => {
                updateStatsEmails(payload);
            });

            Emitter.on("support-tickets-new", (payload) => {
                addNewEmail(payload);
            });

            Emitter.on("support-tickets-update", (payload) => {
                updateEmail(payload);
            });

            Emitter.on("support-tickets-not-assigned", (payload) => {
                addEmailNotAssigned(payload);
            });
        }
        return () => {
            Emitter.off("support-tickets-totals");
            Emitter.off("support-tickets-stats");
            Emitter.off("support-tickets-new");
            Emitter.off("support-tickets-update");
            Emitter.off("support-tickets-not-assigned");
        };
    }, []);

    const addEmailNotAssigned = (payload) => {
        const currentEmailTab = currentEmailTabRef.current;
        const teamSelected = teamSelectedRef.current;

        if (currentEmailTab === "notAssigned") {
            const eventId = get(payload, "_id", "");
            try {
                const allEmails = allEmailsRef.current;
                const company = companyRef.current;
                JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                    const payloadEvent = get(data, "data.data.payload", {});
                    const emailFiltered = get(payloadEvent, "company.id", 0) === company.id;
                    if (emailFiltered) {
                        if (isEmpty(teamSelected)) {
                            setTicketsTableData(mergeById(allEmails, payloadEvent, "_id"));
                        } else {
                            const emailBelongsToTeam = get(payloadEvent, "team.id", 0) === teamSelected.id;
                            if (emailBelongsToTeam) {
                                setTicketsTableData(mergeById(allEmails, payloadEvent, "_id"));
                            }
                        }
                    }
                });
                getNotAssignedTotals();
            } catch (error) {
                console.log("error ", error);
            }
        }
    };

    const getEmailTotals = async () => {
        try {
            const {
                data: { data },
            } = await DashboardServer.get(`/companies/${company.id}/tickets/totals`, {
                params: {
                    ...(teamSelected ? { teamId: teamSelected.id } : {}),
                },
            });

            const totals = get(data, "totals", []);
            const firstTotals = first(totals);

            setTotalEmails(get(firstTotals, "Total", 0));
            setNewEmails(get(firstTotals, "New", 0));
            setOpenEmails(get(firstTotals, "Open", 0));
            setClosedEmails(get(firstTotals, "Closed", 0));
            setPendingEmails(get(firstTotals, "Pending", 0));
            setSolvedEmails(get(firstTotals, "Resolved", 0));
            setDrafts(get(firstTotals, "Draft", 0));

            // setNotAssignedEmails(get(firstTotals, "NotAssigned", 0));
            setToExpireEmails(get(firstTotals, "ToExpire", 0));
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const getEmailStats = async () => {
        setLoading(true);

        try {
            const {
                data: { data },
            } = await DashboardServer.get(`/companies/${company.id}/tickets/Stats`, {
                params: {
                    ...(teamSelected ? { teamId: teamSelected.id } : {}),
                },
            });

            const stats = get(data, "stats", []);
            const firstStats = first(stats);

            setFirstResponseTime(msToHMS(get(firstStats, "firstResponseTimeAverage", 0)));
            setSolutionTime(msToHMS(get(firstStats, "solutionTimeAverage", 0)));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    /* We use this function because we need to send the date of the current month */
    const getNotAssignedTotals = async () => {
        try {
            const { data } = await DashboardServer.get(`/companies/${company.id}/tickets/getTickets`, {
                params: {
                    page: 0,
                    limit: 10,
                    sort: "DESC",
                    status: "notAssigned",
                    ...(teamSelected ? { teamId: [teamSelected.id] } : {}),
                    startAt: new Date(dayjs().startOf("month").subtract(3, "months").format("YYYY-MM-DD")),
                    endAt: new Date(dayjs().endOf("month")),
                },
            });
            const { pagination } = data;
            const total = get(pagination, "total", 0);
            const totalPages = get(pagination, "totalPages", 1);
            setNotAssignedEmails(total);
            setMaxPageNumber(totalPages);
        } catch (error) {
            console.log(error);
        }
    };

    const getEmailsInfo = async () => {
        setEmailsIsLoading(true);
        try {
            const { data } = await DashboardServer.get(`/companies/${company.id}/tickets/getTickets`, {
                params: {
                    page: pageNumber,
                    limit: rowsPageNumber,
                    sort: "DESC",
                    ...(emailsStatus ? { status: emailsStatus } : {}),
                    ...(teamSelected ? { teamId: [teamSelected.id] } : {}),
                    ...(emailsStatus === "notAssigned"
                        ? {
                              startAt: new Date(dayjs().startOf("month").subtract(3, "months").format("YYYY-MM-DD")),
                              endAt: new Date(dayjs().endOf("month")),
                          }
                        : {}),
                },
            });
            const { pagination } = data;
            const totalPages = get(pagination, "totalPages", 1);
            setMaxPageNumber(totalPages);
            const { results } = data;
            let filteredEmails = results;
            if (isEmpty(emailsStatus)) {
                filteredEmails = results.filter((email) => email.status !== "draft");
            }
            setTicketsTableData(filteredEmails);
            setEmailsIsLoading(false);
        } catch (error) {
            console.log(error);
            setEmailsIsLoading(false);
        }
    };

    const getCurrentEmailsTab = (tab) => {
        switch (tab) {
            case "all":
                return totalEmails;
            case "new":
                return newEmails;
            case "open":
                return openEmails;
            case "closed":
                return closedEmails;
            case "pending":
                return pendingEmails;
            case "resolved":
                return solvedEmails;
            case "notAssigned":
                return notAssignedEmails;
            default:
                break;
        }
    };

    return (
        <>
            <Stats
                loading={loading}
                totalEmails={totalEmails}
                newEmails={newEmails}
                openEmails={openEmails}
                pendingEmails={pendingEmails}
                solvedEmails={solvedEmails}
                closedEmails={closedEmails}
                firstResponseTime={firstResponseTime}
                solutionTime={solutionTime}
                notAssignedEmails={notAssignedEmails}
            />

            <div className="mb-4 mt-4 w-full rounded-1 bg-white">
                <div className="flex items-center justify-between px-6 py-4">
                    <p className="text-xl font-bold text-gray-400">{t("monitoring.Emails")}</p>
                </div>
                <SupportTicketsMenu
                    setCurrentTab={setCurrentTab}
                    toExpireEmails={toExpireEmails}
                    setEmailsStatus={setEmailsStatus}
                    totalEmails={totalEmails}
                    newEmails={newEmails}
                    openEmails={openEmails}
                    pendingEmails={pendingEmails}
                    closedEmails={closedEmails}
                    notAssignedEmails={notAssignedEmails}
                    solvedEmails={solvedEmails}
                    drafts={drafts}
                />

                <SupportTicketsTable
                    teamOptions={teamOptions}
                    botEmail={botEmail}
                    rowsPageNumber={rowsPageNumber}
                    setRowsPageNumber={setRowsPageNumber}
                    totalResults={getCurrentEmailsTab(currentTab)}
                    maxPageNumber={maxPageNumber}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    data={orderBy(ticketsTableData, ["updatedAt"], ["desc"])}
                    ticketsIsLoading={emailsIsLoading}
                    operatorOptions={operatorOptions}
                    currentTab={currentTab}
                />
            </div>
        </>
    );
}

export default MonitoringTickets;
