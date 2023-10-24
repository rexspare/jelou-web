import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, useParams } from "react-router-dom";

import { TeamIcon } from "@apps/shared/icons";
import { addTeamScopes } from "@apps/redux/store";
import LiveChats from "@apps/monitoring/live/chats";
import LivePosts from "@apps/monitoring/live/posts";
import { ComboboxSelect } from "@apps/shared/common";
import LiveTickets from "@apps/monitoring/live/tickets";
import { BindingLiveEvents } from "@apps/monitoring/ui-shared";

export function MonitoringLive(props) {
    const {
        botEmail,
        totalEmails,
        newEmails,
        openEmails,
        pendingEmails,
        solvedEmails,
        closedEmails,
        toExpireEmails,
        notAssignedEmails,
        setEmailsStatus,
        rowsPageNumber,
        setRowsPageNumber,
        totalResults,
        pageNumber,
        setPageNumber,
        emailsIsLoading,
        teamOptions,
        operatorOptions,
        renderTeams,
        setShowPage404,
        showPage404,
        publicBots,

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
    } = props;

    const dispatch = useDispatch();
    const userSession = useSelector((state) => state.userSession);

    const [teamSelected, setTeamSelected] = useState({});

    const monitorAllTeams = get(userSession, "monitorAllTeams", false);
    const userScopes = monitorAllTeams ? [] : get(userSession, "teamScopes", []);

    const { subsection } = useParams();

    const isActiveClassName = " w-fit items-center flex h-[2.5rem] rounded-[0.5rem] px-4 text-15 xxl:text-lg bg-[#EDF7F9] text-primary-200";
    const isNotActiveClassName = "w-fit items-center flex rounded-[0.5rem] px-4 py-1 text-gray-400";

    const { t } = useTranslation();

    const selectTeam = (team) => {
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

    useEffect(() => {
        return () => {
            cleanTeamFilter();
        };
    }, []);

    if (!subsection) {
        return <Navigate from={`/monitoring/live`} to={`/monitoring/live/chats`} />;
    }

    return (
        <BindingLiveEvents>
            <div className="flex h-16 w-full items-center rounded-b-1 border-t-default border-gray-100/25 bg-[#FAFBFC] px-6">
                {teamOptions.length > 1 && !ifKia && (
                    <div className="mr-5 w-64">
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
                    </div>
                )}

                <NavLink to={"/monitoring/live/chats"} onClick={() => cleanTeamFilter()} className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                    <p className="font-bold">{t("pma.Chats")}</p>
                </NavLink>

                {!isEmpty(botEmail) && (
                    <NavLink to={"/monitoring/live/emails"} onClick={() => cleanTeamFilter()} className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                        <p className="font-bold">{t("pma.Emails")}</p>
                    </NavLink>
                )}

                {!isEmpty(publicBots) && (
                    <NavLink to={"/monitoring/live/posts"} onClick={() => cleanTeamFilter()} className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                        <p className="font-bold">{t("monitoring.Publicaciones")}</p>
                    </NavLink>
                )}
            </div>

            {subsection === "chats" && (
                <LiveChats
                    botEmail={botEmail}
                    totalEmails={totalEmails}
                    newEmails={newEmails}
                    openEmails={openEmails}
                    pendingEmails={pendingEmails}
                    solvedEmails={solvedEmails}
                    closedEmails={closedEmails}
                    toExpireEmails={toExpireEmails}
                    notAssignedEmails={notAssignedEmails}
                    setEmailsStatus={setEmailsStatus}
                    rowsPageNumber={rowsPageNumber}
                    setRowsPageNumber={setRowsPageNumber}
                    totalResults={totalEmails}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    emailsIsLoading={emailsIsLoading}
                    operatorOptions={operatorOptions}
                    //KIA
                    ifKia={ifKia}
                    filteredCategory={filteredCategory}
                    setFilteredCategory={setFilteredCategory}
                    filteredAgencies={filteredAgencies}
                    setFilteredAgencies={setFilteredAgencies}
                    filteredGroups={filteredGroups}
                    setFilteredGroups={setFilteredGroups}
                    filteredCities={filteredCities}
                    setFilteredCities={setFilteredCities}
                    getOperators={getOperators}
                    teamSelected={teamSelected}
                    teamOptions={teamOptions}
                />
            )}
            {subsection === "emails" && (
                <LiveTickets
                    teamSelected={teamSelected}
                    setShowPage404={setShowPage404}
                    showPage404={showPage404}
                    renderTeams={renderTeams}
                    botEmail={botEmail}
                    totalEmails={totalEmails}
                    newEmails={newEmails}
                    openEmails={openEmails}
                    pendingEmails={pendingEmails}
                    solvedEmails={solvedEmails}
                    closedEmails={closedEmails}
                    toExpireEmails={toExpireEmails}
                    notAssignedEmails={notAssignedEmails}
                    setEmailsStatus={setEmailsStatus}
                    rowsPageNumber={rowsPageNumber}
                    setRowsPageNumber={setRowsPageNumber}
                    totalResults={totalResults}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    emailsIsLoading={emailsIsLoading}
                    operatorOptions={operatorOptions}
                    teamOptions={teamOptions}
                />
            )}
            {subsection === "posts" && <LivePosts teamOptions={teamOptions} teamSelected={teamSelected} />}
        </BindingLiveEvents>
    );
}
export default MonitoringLive;
