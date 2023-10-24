import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import dayjs from "dayjs";
import "dayjs/locale/es";
import qs from "qs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, useLocation, useParams } from "react-router-dom";

import { Email } from "@apps/monitoring/conversations/email";
import { HistoryFilters, Chat, Sidebar } from "@apps/monitoring/ui-shared";
import { addMessages, addTeamScopes, setCurrentRoom } from "@apps/redux/store";
import { ComboboxSelect } from "@apps/shared/common";
import { TeamIcon } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";

export function MonitoringHistory(props) {
    const { teamOptions, botOptions, operatorOptions, hasEmailBot } = props;
    const company = useSelector((state) => state.company);

    const { subsection } = useParams();
    const [emails, setEmails] = useState([]);
    const [showEmail, setShowEmail] = useState(false);

    const dispatch = useDispatch();

    const [botSelected, setBotSelected] = useState([]);
    const [operatorSelected, setOperatorSelected] = useState([]);
    const [teamSelected, setTeamSelected] = useState([]);

    const { t } = useTranslation();

    const cleanTeamFilter = () => {
        setTeamSelected("");
    };

    const isActiveClassName = " w-fit items-center flex h-[2.5rem] rounded-[0.5rem] px-4 text-15 xxl:text-lg bg-[#EDF7F9] text-primary-200";
    const isNotActiveClassName = "w-fit items-center flex rounded-[0.5rem] px-4 py-1 text-gray-400";

    const selectBot = (bot) => {
        setBotSelected(bot);
    };

    const selectOperator = (operator) => {
        setOperatorSelected(operator);
    };

    const clearSearchFilter = () => {
        if (!isEmpty(emailsQuerySearch)) {
            setEmailsSearchBy("");
            setEmailsQuerySearch("");
        }
    };
    const [emailsSearchBy, setEmailsSearchBy] = useState("");
    const [emailsQuerySearch, setEmailsQuerySearch] = useState("");
    const [conversations, setConversations] = useState([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [loadingChangeChat, setLoadingChangeChat] = useState(true);
    const [initialDate, setInitialDate] = useState(new Date(dayjs().day(1).startOf("day")));
    const [finalDate, setFinalDate] = useState(new Date(dayjs().endOf("day")));
    const [clientId, setClientId] = useState(null);
    const [pageLimit, setPageLimit] = useState(1);
    const [row] = useState(10);
    const [teamsCleaned, setTeamsCleaned] = useState(false);
    const [mess, setMess] = useState([]);
    const [maxPage, setMaxPage] = useState(1);

    const [isDeletedConversations, setIsDeletedConversations] = useState(false);

    const cleanTeams = () => {
        setPageLimit(1);
        setTeamsCleaned(true);
        if (teamScopes) {
            setTeamSelected(
                teamOptions.map((team) => {
                    return team.id;
                })
            );
        } else {
            setTeamSelected("");
        }
    };

    const setClientNumber = ({ target }) => {
        const { value } = target;
        setClientId(value);
    };

    const userSession = useSelector((state) => state.userSession);
    const teamScopes = useSelector((state) => state.teamScopes);

    const showConversation = async (conversation) => {
        const { id } = conversation.bot;
        const { referenceId } = conversation.user;
        const { _id } = conversation.lastMessage;
        try {
            const { clientId, clientSecret } = company;
            if (!isEmpty(userSession) && !isEmpty(clientId) && !isEmpty(clientSecret)) {
                const { clientId: username, clientSecret: password } = company;
                const { data } = await JelouApiV1.get(`/bots/${id}/users/${referenceId}/v2/history`, {
                    params: {
                        limit: 20,
                        _id,
                        direction: "older_equal",
                    },
                    auth: {
                        username,
                        password,
                    },
                });
                const { chat } = data;
                setMess(chat);
                dispatch(addMessages(chat));
                setLoadingChangeChat(false);
            }
        } catch (error) {
            console.log("error ", error);
        }
    };

    const dailyConversations = async (startAt, endAt, conversationId) => {
        try {
            const { clientId: username, clientSecret: password, id } = company;
            const operatorId = get(operatorSelected, "id", "");
            const botId = get(botSelected, "id", "");

            if (!isEmpty(userSession) && !isEmpty(username) && !isEmpty(password)) {
                const { data } = await JelouApiV1.get(`/company/${id}/conversations`, {
                    params: {
                        page: pageLimit,
                        limit: row,
                        deleted: isDeletedConversations,
                        ...(!isEmpty(operatorSelected) ? { operatorId } : {}),
                        ...(startAt ? { startAt: startAt } : { startAt: initialDate }),
                        ...(endAt ? { endAt: endAt } : { endAt: finalDate }),
                        ...(clientId ? { clientId: clientId } : {}),
                        ...(conversationId ? { conversationId: conversationId } : {}),
                        ...(!isEmpty(teamScopes) && teamsCleaned
                            ? { teams: teamSelected }
                            : !isEmpty(teamSelected)
                            ? { teams: [get(teamSelected, "id")] }
                            : {}),
                        ...(!isEmpty(botId) ? { botId } : {}),
                    },
                    paramsSerializer: (params) => {
                        return qs.stringify(params);
                    },
                    auth: {
                        username,
                        password,
                    },
                });
                const { totalPages } = data.pagination;
                const { results } = data;
                setIsLoadingConversations(false);
                if (!isEmpty(results)) {
                    dispatch(setCurrentRoom(first(results)));
                    showConversation(first(results));
                    setMaxPage(totalPages);
                } else {
                    setMaxPage(1);
                    dispatch(setCurrentRoom(results));
                    setMess([]);
                    setLoadingChangeChat(false);
                    // setIsLoadingConversations(false);
                }
                setConversations(results);
            } else {
                setIsLoadingConversations(false);
            }
        } catch (error) {
            setIsLoadingConversations(false);
            console.log("error ", error);
        }
    };

    const { state: stateFromLocation } = useLocation();
    const getConversations = () => {
        if (isEmpty(stateFromLocation)) {
            dailyConversations();
        } else {
            const { _id, startAt, endAt } = stateFromLocation;
            dailyConversations(startAt, endAt, _id);
        }
    };

    useEffect(() => {
        if (!isEmpty(company)) {
            setIsLoadingConversations(true);
            getConversations();
        }
    }, [company, userSession, pageLimit, operatorSelected, botSelected, teamSelected, finalDate, isDeletedConversations]);

    if (!subsection) {
        return <Navigate from={`/monitoring/history`} to={`/monitoring/history/chats`} />;
    }
    const selectTeam = (team) => {
        setTeamSelected(team);
        const selectedTeam = get(team, "id", 0);
        dispatch(addTeamScopes([selectedTeam]));
    };

    return (
        <div className="flex flex-col">
            <div className="flex h-16 w-full items-center rounded-b-1 border-t-default border-gray-100/25 bg-[#FAFBFC] px-6">
                <div className="mr-5 w-64">
                    {teamOptions.length > 1 && (
                        <ComboboxSelect
                            background="#FAFBFC"
                            value={teamSelected}
                            handleChange={selectTeam}
                            name="team"
                            options={teamOptions}
                            label={t("monitoring.Equipos")}
                            icon={<TeamIcon width="1.3125rem" height="1rem" fillOpacity="0.75" />}
                            placeholder={t("monitoring.Seleccionar Equipo")}
                            clearFilter={cleanTeamFilter}
                        />
                    )}
                </div>
                <NavLink
                    to={"/monitoring/history/chats"}
                    onClick={() => {
                        setOperatorSelected([]);
                        setTeamSelected([]);
                    }}
                    className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                    <p className="font-bold">{t("Chats")}</p>
                </NavLink>
                {hasEmailBot && (
                    <NavLink
                        to={"/monitoring/history/emails"}
                        onClick={() => {
                            setOperatorSelected([]);
                            setTeamSelected([]);
                        }}
                        className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                        <p className="font-bold">{t("Emails")}</p>
                    </NavLink>
                )}
            </div>
            <div className="mt-8">
                <HistoryFilters
                    dailyConversations={dailyConversations}
                    setPageLimit={setPageLimit}
                    cleanTeams={cleanTeams}
                    setInitialDate={setInitialDate}
                    setFinalDate={setFinalDate}
                    setClientNumber={setClientNumber}
                    setShowEmail={setShowEmail}
                    emails={emails}
                    setEmailsSearchBy={setEmailsSearchBy}
                    emailsSearchBy={emailsSearchBy}
                    setEmailsQuerySearch={setEmailsQuerySearch}
                    emailsQuerySearch={emailsQuerySearch}
                    botSelected={botSelected}
                    operatorSelected={operatorSelected}
                    selectBot={selectBot}
                    selectOperator={selectOperator}
                    selectTeam={selectTeam}
                    cleanBots={() => setBotSelected([])}
                    cleanOperators={() => setOperatorSelected([])}
                    botOptions={botOptions}
                    teamOptions={teamOptions}
                    clearSearchFilter={clearSearchFilter}
                    operatorOptions={operatorOptions}
                    initialDate={initialDate}
                    finalDate={finalDate}
                    setIsLoadingConversations={setIsLoadingConversations}
                    setMess={setMess}
                />
            </div>
            {subsection === "emails" && (
                <Email
                    teamSelected={teamSelected}
                    initialDate={initialDate}
                    finalDate={finalDate}
                    showEmail={showEmail}
                    setShowEmail={setShowEmail}
                    emails={emails}
                    setEmails={setEmails}
                    operatorSelected={operatorSelected}
                    emailsSearchBy={emailsSearchBy}
                    emailsQuerySearch={emailsQuerySearch}
                    setOperatorSelected={setOperatorSelected}
                    setTeamSelected={setTeamSelected}
                    setBotSelected={setBotSelected}
                />
            )}
            {subsection === "chats" && (
                <div className="mx-auto flex max-h-[75vh] min-h-[75vh] w-full sm:pb-6">
                    <div className={`flex`}>
                        <Sidebar
                            setMess={setMess}
                            maxPage={maxPage}
                            pageLimit={pageLimit}
                            setPageLimit={setPageLimit}
                            conversations={conversations}
                            setLoadingChangeChat={setLoadingChangeChat}
                            isDeletedConversations={isDeletedConversations}
                            isLoadingConversations={isLoadingConversations}
                            setIsDeletedConversations={setIsDeletedConversations}
                            setIsLoadingConversations={setIsLoadingConversations}
                        />
                    </div>
                    <Chat
                        dailyConversations={getConversations}
                        loadingChat={loadingChangeChat}
                        isLoadingConversations={isLoadingConversations}
                        setMess={setMess}
                        mess={mess}
                        showConversation={showConversation}
                    />
                </div>
            )}
        </div>
    );
}
export default MonitoringHistory;
