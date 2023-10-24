import get from "lodash/get";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

// import "../../i18n";
import FormTeam from "./FormTeam";

import { Modal } from "@apps/shared/common";
import TeamsTable from "./TeamsTable";
import DeleteTeam from "./DeleteTeam";
import { DashboardServer } from "@apps/shared/modules";
import Filters from "../../common/Filters";
import { Circle } from "@apps/shared/icons";
import { SimpleRowSkeleton } from "@apps/shared/common";
import { useSelector } from "react-redux";

const INITIAL_FILTERS = { state: [] };

const Teams = (props) => {
    const { permissionsList, openForm, setOpenForm, activeTeam, setActiveTeam, tab, setTab, teamSidebar, setTeamSidebar, notify, company } = props;
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [teamsList, setTeamsList] = useState([]);
    const [newTeam, setNewTeam] = useState(null);
    const viewPermission = !!permissionsList.find((data) => data === "team:view_team");
    const editPermission = !!permissionsList.find((data) => data === "team:update_team");
    const deletePermission = !!permissionsList.find((data) => data === "team:delete_team");
    let loadingSkeleton = [];
    const [query, setQuery] = useState("");
    const [pageLimit, setPageLimit] = useState(1);
    const [maxPage, setMaxPage] = useState(null);
    const [team, setTeam] = useState({});
    const [deleteModal, setDeleteModal] = useState(false);
    const [nrows, setRows] = useState(10);
    const [selectedOptions, setSelectedOptions] = useState(INITIAL_FILTERS);
    const [errors, setErrors] = useState("");
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const companyId = get(company, "id");
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const activeOptions = [
        {
            id: -1,
            value: -1,
            label: t("AdminFilters.all"),
            name: t("AdminFilters.all"),
        },
        { id: 2, value: 2, label: true, name: t("AdminFilters.active") },
        { id: 3, value: 3, label: false, name: t("AdminFilters.noActive") },
    ];
    const [desactivate, setDesactivate] = useState(false);

    const handleActivateTeam = (team) => {
        setTeam(team);
        setDeleteModal(true);
        setDesactivate(true);
    };

    const [loadingQuery, setLoadingQuery] = useState(false);
    const [filteredTeamScopes, setFilteredTeamScopes] = useState([]);
    const [seeAllUsers, setSeeAllUsers] = useState(false);
    const userSession = useSelector((state) => state.userSession);

    const onChangeState = (status) => {
        setSelectedOptions({ ...selectedOptions, state: status });
    };

    const clearState = () => {
        setSelectedOptions({ ...selectedOptions, state: [] });
    };

    const teamsFilter = [
        {
            name: t("AdminFilters.state"),
            options: activeOptions,
            value: selectedOptions.state,
            onChange: onChangeState,
            clear: clearState,
            icon: <Circle width="0.75rem" fill="white" />,
        },
    ];
    const loadTeams = async (team) => {
        try {
            let params = {};
            if (team) {
                setLoadingQuery(true);
                params = {
                    ...(team ? { query: team } : {}),
                    shouldPaginate: true,
                    withUsers: true,
                };
            } else {
                params = {
                    shouldPaginate: true,
                    limit: nrows,
                    page: pageLimit,
                    ...(team ? { query: team } : {}),
                    withUsers: true,
                };
            }
            if (selectedOptions !== INITIAL_FILTERS) {
                if (selectedOptions["state"].length === 1) {
                    params.state = first(selectedOptions["state"]).label;
                }
            }

            const { data } = await DashboardServer.get(`/companies/${companyId}/teams`, {
                params,
            });
            setTeamsList(get(data, "data.results", []));
            setMaxPage(get(data, "data.pagination.totalPages", 1));
            setLoading(false);
            setLoadingQuery(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setLoadingQuery(false);
        }
    };

    const getTeamScopes = () => {
        try {
            const teamScopes = get(userSession, "teamScopes", []);
            const filteredArray = teamsList.filter((team) => teamScopes.includes(team.id));
            setFilteredTeamScopes(filteredArray);
            if (isEmpty(filteredArray)) {
                setSeeAllUsers(true);
            } else {
                setSeeAllUsers(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTeamScopes();
    }, [teamsList]);

    const handleTeam = (index) => {
        setTab("generales");
        setActiveTeam(index);
        setOpenForm(true);
    };

    useEffect(() => {
        setLoading(true);
        loadTeams();
    }, [pageLimit, nrows]);

    useEffect(() => {
        if (!isEmpty(query)) {
            setPageLimit(1);
        }
    }, [query]);

    for (let i = 0; i < 6; i++) {
        loadingSkeleton.push(<SimpleRowSkeleton key={i} />);
    }

    const onConfirmActivate = async () => {
        try {
            setLoadingFeedback(true);
            await DashboardServer.patch(`/companies/${companyId}/teams/${team.id}`, team);
            setDeleteModal(false);
            setTeam({});
            setLoadingFeedback(false);
            notify(t("teamsForm.successActivateTeam"));
            setTimeout(() => {
                setLoading(true);
                loadTeams(query);
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteTeam = (team) => {
        setTeam(team);
        setDeleteModal(true);
        setDesactivate(false);
    };

    const handleViewTeam = (team) => {
        setOpenForm(true);
        setTeam(team);
        setActiveTeam(team);
    };

    const onConfirmDelete = async () => {
        try {
            setLoadingFeedback(true);
            await DashboardServer.delete(`/companies/${companyId}/teams/${team.id}`);
            setDeleteModal(false);
            setTeam({});
            setLoadingFeedback(false);
            notify(t("teamsForm.successDeleteTeam"));
            setTimeout(() => {
                setLoading(true);
                loadTeams(query);
            }, 1000);
        } catch (error) {
            console.log(error);
            const { response } = error;
            setLoading(false);
            const msg = get(response, "data.error.clientMessages", {});
            setErrors(get(msg, lang, t("registerBusiness.errorPhrase")));
            setLoadingFeedback(false);
        }
    };

    return (
        <>
            <ToastContainer />
            {viewPermission && (
                <>
                    <div className="mt-4 rounded-t-1 bg-white px-2">
                        <Filters
                            INITIAL_FILTERS={INITIAL_FILTERS}
                            filters={teamsFilter}
                            loadResults={loadTeams}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            loadingQuery={loadingQuery}
                            setPageLimit={setPageLimit}
                            query={query}
                            setQuery={setQuery}
                        />
                    </div>
                    <TeamsTable
                        handleActivateTeam={handleActivateTeam}
                        loading={loading}
                        pageLimit={pageLimit}
                        setPageLimit={setPageLimit}
                        data={seeAllUsers ? teamsList : filteredTeamScopes}
                        editPermission={editPermission}
                        deletePermission={deletePermission}
                        handleDeleteTeam={handleDeleteTeam}
                        handleViewTeam={handleViewTeam}
                        nrows={nrows}
                        setRows={setRows}
                        maxPage={maxPage}
                    />
                </>
            )}

            {deleteModal && (
                <div className="relative">
                    <Modal>
                        <DeleteTeam
                            team={team}
                            onConfirm={desactivate ? onConfirmActivate : onConfirmDelete}
                            setOpen={setDeleteModal}
                            setNewTeam={setNewTeam}
                            teamsList={teamsList}
                            name={team ? team.name : ""}
                            errors={errors}
                            loading={loadingFeedback}
                            desactivate={desactivate}
                        />
                    </Modal>
                </div>
            )}
            {openForm && (
                <div className="w-full">
                    <Modal>
                        <FormTeam
                            team={activeTeam}
                            query={query}
                            setActiveTeam={setActiveTeam}
                            handleTeam={handleTeam}
                            loadTeams={loadTeams}
                            setOpenForm={setOpenForm}
                            setNewTeam={setNewTeam}
                            permissionsList={permissionsList}
                            teamSidebar={teamSidebar}
                            setTeamSidebar={setTeamSidebar}
                            setTab={setTab}
                            tab={tab}
                            newTeam={newTeam}
                        />
                    </Modal>
                </div>
            )}
        </>
    );
};

export default Teams;
