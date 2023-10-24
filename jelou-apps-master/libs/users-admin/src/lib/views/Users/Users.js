import axios from "axios";
import get from "lodash/get";
import first from "lodash/first";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import FileDownload from "js-file-download";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { useState, useEffect, useRef } from "react";

import FormUser from "./FormUser";
import { Modal } from "@apps/shared/common";
import UsersTable from "./UsersTable";
import DeleteUser from "./DeleteUser";
import { DashboardServer } from "@apps/shared/modules";
import Filters from "../../common/Filters";
import { TeamIcon, Role, Circle } from "@apps/shared/icons";

const INITIAL_FILTERS = { roles: [], teams: [], state: [] };

const Users = (props) => {
    const { permissionsList, newUser, setNewUser, defaultRoles, legacyRoles, company, isImpersonate, notify } = props;
    const { t } = useTranslation();
    const ref = useRef();
    const [nrows, setRows] = useState(10);
    const [loading, setLoading] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [pageLimit, setPageLimit] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(INITIAL_FILTERS);
    const [usersList, setUsersList] = useState([]);
    const [query, setQuery] = useState("");
    const [teamsList, setTeamsList] = useState([]);
    const [maxPage, setMaxPage] = useState(null);
    const [rolesList, setRolesList] = useState([]);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [errors, setErrors] = useState("");
    const [user, setUser] = useState({});
    const [viewUser, setViewUser] = useState(false);
    const [desactivate, setDesactivate] = useState(false);
    const viewPermission = !!permissionsList.find((data) => data === "user:view_user");
    const deletePermission = !!permissionsList.find((data) => data === "user:delete_user");
    const editPermission = !!permissionsList.find((data) => data === "user:update_user");
    const companyId = get(company, "id");
    const [loadingQuery, setLoadingQuery] = useState(false);
    const userSession = useSelector((state) => state.userSession);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const [cancelToken, setCancelToken] = useState();

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

    const [filteredTeamScopes, setFilteredTeamScopes] = useState([]);
    const [seeAllUsers, setSeeAllUsers] = useState(false);

    let activeTeams = seeAllUsers ? teamsList : filteredTeamScopes;
    activeTeams = activeTeams.filter((team) => team.state === true);

    const onChangeState = (status) => {
        setSelectedOptions({ ...selectedOptions, state: status });
    };

    const onChangeRoles = (roles) => {
        setSelectedOptions({ ...selectedOptions, roles: roles });
    };

    const onChangeTeams = (teams) => {
        setSelectedOptions({ ...selectedOptions, teams: teams });
    };

    const clearState = (status) => {
        setSelectedOptions({ ...selectedOptions, state: [] });
    };

    const clearRoles = (roles) => {
        setSelectedOptions({ ...selectedOptions, roles: [] });
    };

    const clearTeams = (teams) => {
        setSelectedOptions({ ...selectedOptions, teams: [] });
    };

    const usersFilter = [
        {
            id: 0,
            name: t("AdminFilters.state"),
            options: activeOptions,
            value: selectedOptions.state,
            onChange: onChangeState,
            clear: clearState,
            icon: <Circle width="0.75rem" fill="white" />,
        },
        {
            id: 1,
            name: t("AdminFilters.roles"),
            options: rolesList,
            value: selectedOptions.roles,
            onChange: onChangeRoles,
            clear: clearRoles,
            icon: <Role width="1.25rem" height="1.063rem" fill="white" />,
        },
        {
            id: 2,
            name: t("AdminFilters.teams"),
            options: activeTeams,
            value: selectedOptions.teams,
            onChange: onChangeTeams,
            clear: clearTeams,
            icon: <TeamIcon width="1.25rem" height="1.063rem" fillOpacity="0.75" title={false} />,
        },
    ];

    const getTeamScopes = async () => {
        try {
            const teamScopes = get(userSession, "teamScopes", []);
            const teams = get(userSession, "teams", []);

            let filteredArray = [];
            if (!isEmpty(teamScopes)) {
                filteredArray = teamsList.filter((team) => teamScopes.includes(team.value) || teams.includes(team.value));
            } else {
                filteredArray = teamsList;
            }

            filteredArray.push({
                id: -1,
                label: t("AdminFilters.all"),
                name: t("AdminFilters.all"),
            });
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
        if (!isEmpty(teamsList) && !isEmpty(userSession)) {
            getTeamScopes();
        }
    }, [teamsList, userSession]);

    const handleDesactivateUser = (user) => {
        setUser(user);
        setDeleteModal(true);
        setDesactivate(true);
    };

    const handleActivateUser = (user) => {
        setUser(user);
        setDeleteModal(true);
        setDesactivate(false);
    };

    useEffect(() => {
        if (newUser) {
            handleViewUser({});
        }
    }, [newUser]);

    useEffect(() => {
        if (!viewUser) {
            setNewUser(false);
            setUser({});
        }
    }, [viewUser]);

    const handleViewUser = (userObj) => {
        setViewUser(true);
        setUser(userObj);
    };

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        if (!isEmpty(company)) {
            loadRoles();
        }
    }, [company]);

    useEffect(() => {
        if (!isEmpty(userSession)) {
            loadUsers();
        }
    }, [userSession, pageLimit, nrows]);

    useEffect(() => {
        if (!isEmpty(query)) {
            setPageLimit(1);
        }
    }, [query]);

    const downloadUsers = async () => {
        setLoadingDownload(true);

        try {
            let params = {
                ...(user ? { query: query } : {}),
                download: true,
                ...(selectedOptions === INITIAL_FILTERS),
            };
            if (selectedOptions !== INITIAL_FILTERS) {
                const filterKeys = Object.keys(selectedOptions);
                filterKeys.forEach((filter) => {
                    let ids = [];
                    if (!isEmpty(selectedOptions[filter])) {
                        if (filter === "state") {
                            if (selectedOptions[filter].length === 1) {
                                params.state = first(selectedOptions[filter]).value;
                            }
                        } else {
                            selectedOptions[filter].map((obj) => obj.value !== "*" && ids.push(obj.value));
                            params[filter] = ids;
                        }
                    }
                });
            }
            const { data } = await DashboardServer.get(`/companies/${companyId}/users`, {
                responseType: "blob",
                params,
            }).catch((error) => {
                console.log(error);
            });
            FileDownload(data, "users_report.xlsx");
            setLoadingDownload(false);
        } catch (error) {
            setLoadingDownload(false);
            console.log(error);
        }
    };

    const loadUsers = async (user) => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Cancelling");
        }
        setLoading(true);
        try {
            const source = axios.CancelToken.source();
            setCancelToken(source);
            let params = {};
            if (user) {
                params = {
                    ...(user ? { query: user } : {}),
                    shouldPaginate: true,
                    ...(selectedOptions === INITIAL_FILTERS),
                };
                setLoadingQuery(true);
            } else {
                params = {
                    shouldPaginate: true,
                    limit: nrows,
                    page: pageLimit,
                    ...(selectedOptions === INITIAL_FILTERS),
                };
            }

            if (selectedOptions !== INITIAL_FILTERS) {
                const filterKeys = Object.keys(selectedOptions);
                filterKeys.forEach((filter) => {
                    let ids = [];
                    if (!isEmpty(selectedOptions[filter])) {
                        if (filter === "state") {
                            if (selectedOptions[filter].length === 1) {
                                params.state = first(selectedOptions[filter]).label;
                            }
                        } else {
                            selectedOptions[filter].map((obj) => obj.value !== "*" && ids.push(obj.value));
                            params[filter] = ids;
                        }
                    }
                });
            }
            const { data } = await DashboardServer.get(`/companies/${companyId}/users`, {
                params,
                cancelToken: source.token,
            }).catch((error) => {
                console.log(error);
            });
            setUsersList(data.results);
            setMaxPage(get(data, "pagination.totalPages", 1));
            setLoading(false);
            setLoadingQuery(false);
        } catch (error) {
            if (toUpper(error.message) === "CANCELLING") {
                setLoading(true);
            } else {
                setLoading(false);
                setLoadingQuery(false);
                console.log(error);
            }
        }
    };

    const loadRoles = async () => {
        try {
            const resp = await DashboardServer.get(`/companies/${companyId}/roles/permissions`, {
                params: {
                    state: 1,
                    ...(defaultRoles || isImpersonate ? { defaultRoles: true } : { defaultRoles: false }),
                    ...(legacyRoles || isImpersonate ? { legacyRoles: true } : { legacyRoles: false }),
                },
            });
            const { data } = resp;
            const arrayTemp = data.data.results;
            let array = [];
            array.push({ id: -1, label: t("AdminFilters.all"), name: t("AdminFilters.all") });
            arrayTemp.forEach((role) => {
                array.push({ id: role.id, value: role.id, label: role.name, name: role.name });
            });
            setRolesList(array);
        } catch (error) {
            console.log(error);
        }
    };

    const loadTeams = async () => {
        try {
            const { data } = await DashboardServer.get(`/companies/${companyId}/teams`);
            const teams = get(data, "data", []);
            const array = [];
            array.push({
                id: -1,
                label: t("AdminFilters.all"),
                name: t("AdminFilters.all"),
                state: true,
            });
            teams.forEach((team) => {
                array.push({
                    id: team.id,
                    value: team.id,
                    label: team.name,
                    name: team.name,
                    state: team.state,
                });
            });
            setTeamsList(array);
        } catch (error) {
            console.log(error);
        }
    };

    const handleActivation = async () => {
        try {
            if (desactivate) {
                setLoadingFeedback(true);
                await DashboardServer.delete(`/companies/${companyId}/users/${user.id}`);
                notify(t("usersForm.successDeleteUser"));
                setLoadingFeedback(false);
            } else {
                setLoadingFeedback(true);
                await DashboardServer.patch(`/companies/${companyId}/users/${user.id}`, {
                    state: 1,
                });
                notify(t("usersForm.successActivateUser"));
                setLoadingFeedback(false);
            }
            setDeleteModal(false);
            setTimeout(() => {
                loadUsers(query);
            }, 1000);
        } catch (error) {
            const { response } = error;
            const msg = get(response, "data.error.clientMessages", {});
            setErrors(get(msg, lang, t("registerBusiness.errorPhrase")));
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            {viewPermission && (
                <>
                    <div className="mt-4 rounded-t-1 bg-white px-2">
                        <Filters
                            loadingQuery={loadingQuery}
                            query={query}
                            setQuery={setQuery}
                            INITIAL_FILTERS={INITIAL_FILTERS}
                            filters={usersFilter}
                            showDownload={true}
                            loadResults={loadUsers}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            loadingDownload={loadingDownload}
                            downloadUsers={downloadUsers}
                            setPageLimit={setPageLimit}
                        />
                    </div>
                    <UsersTable
                        loading={loading}
                        pageLimit={pageLimit}
                        setPageLimit={setPageLimit}
                        data={usersList}
                        maxPage={maxPage}
                        editPermission={editPermission}
                        deletePermission={deletePermission}
                        handleDesactivateUser={handleDesactivateUser}
                        handleActivateUser={handleActivateUser}
                        handleViewUser={handleViewUser}
                        nrows={nrows}
                        setRows={setRows}
                        lang={lang}
                    />
                </>
            )}

            {deleteModal && (
                <div ref={ref} className="relative">
                    <Modal>
                        <DeleteUser
                            user={user}
                            onConfirm={handleActivation}
                            setOpen={setDeleteModal}
                            setNewUser={setNewUser}
                            usersList={usersList}
                            name={user ? user.names : ""}
                            errors={errors}
                            loading={loadingFeedback}
                            desactivate={desactivate}
                        />
                    </Modal>
                </div>
            )}

            {viewUser && (
                <div ref={ref} className="relative">
                    <FormUser
                        editPermission={editPermission}
                        permissionsList={permissionsList}
                        user={user}
                        query={query}
                        setUser={setUser}
                        setOpen={setViewUser}
                        newUser={newUser}
                        setNewUser={setNewUser}
                        teamsList={teamsList}
                        name={user ? user.names : ""}
                        errors={errors}
                        loading={loadingFeedback}
                        loadUsers={loadUsers}
                        defaultRoles={defaultRoles}
                        legacyRoles={legacyRoles}
                        company={company}
                        isImpersonate={isImpersonate}
                        openModal={viewUser}
                    />
                </div>
            )}
        </>
    );
};

export default Users;
