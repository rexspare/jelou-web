// import '../i18n';
import { Menu } from "@apps/shared/common";
import { JelouApiV1 } from "@apps/shared/modules";
import axios from "axios";
import get from "lodash/get";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Roles from "./views/Roles/Roles";
import Teams from "./views/Teams/Teams";
import Users from "./views/Users/Users";

import isEmpty from "lodash/isEmpty";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const UsersAdmin = (props) => {
    const { permissionsList } = props;
    const [tab, setTab] = useState("");
    const [currentOptionId, setCurrentOptionId] = useState(0);
    const company = useSelector((state) => state.company);
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const usersPermissions = get(permissionsList, "userPermissionsArr", []);
    const teamPermissions = get(permissionsList, "teamPermissionsArr", []);
    const rolesPermissions = get(permissionsList, "rolesPermissionsArr", []);
    const permissions = useSelector((state) => state.permissions);

    const createUserPermission = !!usersPermissions.find((data) => data === "user:create_user");
    const createTeamPermission = !!teamPermissions.find((data) => data === "team:create_team");
    const createRolePermission = !!rolesPermissions.find((data) => data === "rol:create_rol");

    const canCreateRol = get(permissionsList, "rolesPermissionsArr").some((permission) => permission === "rol:create_rol");
    const canViewRol = get(permissionsList, "rolesPermissionsArr").some((permission) => permission === "rol:view_rol");
    const canUpdateRol = get(permissionsList, "rolesPermissionsArr").some((permission) => permission === "rol:update_rol");
    const canDeleteRol = get(permissionsList, "rolesPermissionsArr").some((permission) => permission === "rol:delete_rol");

    //team
    const [openTeamForm, setOpenTeamForm] = useState(false);
    const [activeTeam, setActiveTeam] = useState(null);
    const [teamSidebar, setTeamSidebar] = useState({});
    const [teamTab, setTeamTab] = useState("generales");
    const [newUser, setNewUser] = useState(false);
    const [newRole, setNewRole] = useState(false);

    //role
    const [activeRole, setActiveRole] = useState(null);

    const defaultRoles = get(company, "properties.defaultRoles", true);
    const legacyRoles = get(company, "properties.legacyRoles", false);
    const isImpersonate = !isEmpty(localStorage.getItem("jwt-master"));

    const getCompany = async () => {
        try {
            if (!isEmpty(localStorage.getItem("jwt-master"))) {
                axios.defaults.headers.common["Accept-Language"] = "es";
                axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("jwt-master");
                axios.defaults.headers.common["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
                await JelouApiV1.get(`/company`).catch((error) => {
                    console.log(error);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCompany();
    }, []);

    useEffect(() => {
        if (!isEmpty(permissions)) {
            setTab(!isEmpty(usersPermissions) ? "users" : !isEmpty(teamPermissions) ? "teams" : "roles");
        }
    }, [permissions]);

    const menuOptions = useMemo(() => {
        let tabsArray = [];
        !!usersPermissions.find((data) => data === "user:view_user") && tabsArray.push({ name: t("usersAdmin.usersAdmin"), tab: "users" });
        !!teamPermissions.find((data) => data === "team:view_team") &&
            tabsArray.push({
                name: t("componentCommonSidebar.teams"),
                tab: "teams",
            });
        !!rolesPermissions.some((data) => data.startsWith("rol:")) &&
            tabsArray.push({
                name: t("componentCommonSidebar.roles"),
                tab: "roles",
            });
        return tabsArray;
    }, [permissions, t, lang]);

    const showTeamForm = () => {
        setTeamTab("generales");
        setOpenTeamForm(true);
        setActiveTeam(null);
        setTeamSidebar(null);
    };

    const showRoleForm = (e) => {
        setNewRole(true);
        setActiveRole(null);
    };

    const options = menuOptions.map((opt, index) => {
        return {
            id: index,
            label: opt.children ? opt.children : opt.name,
            hidden: index > 3 ? true : false,
            handleClick: () => {
                setCurrentOptionId(index);
                setTab(opt.tab);
            },
        };
    });

    const notify = (msg) => {
        toast.success(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <svg className="-mt-px ml-4 mr-2" width="1.563rem" height="1.563rem" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                            fill="#0CA010"
                        />
                    </svg>
                    <div className="text-15">{msg}</div>
                </div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    };

    const createUser = tab === "users" && createUserPermission;
    const createTeam = tab === "teams" && createTeamPermission;
    const createRole = tab === "roles" && createRolePermission;
    const showChildren = tab === "users" ? createUser : tab === "teams" ? createTeam : tab === "roles" ? createRole : false;

    return (
        <div className="mx-8 pb-6 pt-2">
            <div className="px-4 pt-4">
                <Menu title={t("usersAdmin.admin")} currentOptionId={currentOptionId} options={options} showChildren={showChildren} lang={lang}>
                    <div className="pl-3">
                        <button
                            type="submit"
                            onClick={
                                tab === "users" && createUser
                                    ? () => setNewUser(true)
                                    : tab === "teams" && createTeam
                                    ? showTeamForm
                                    : tab === "roles" && createRole && canCreateRol
                                    ? showRoleForm
                                    : undefined
                            }
                            className="button-gradient"
                        >
                            <span className="pr-2">+</span>
                            {t("bots.createBot")}
                        </button>
                    </div>
                </Menu>

                <div>
                    {tab === "users" && (
                        <Users
                            permissionsList={usersPermissions}
                            newUser={newUser}
                            setNewUser={setNewUser}
                            tab={tab}
                            defaultRoles={defaultRoles}
                            legacyRoles={legacyRoles}
                            company={company}
                            isImpersonate={isImpersonate}
                            notify={notify}
                        />
                    )}
                </div>
                <div>
                    {tab === "teams" && (
                        <Teams
                            permissionsList={teamPermissions}
                            showForm={showTeamForm}
                            openForm={openTeamForm}
                            setOpenForm={setOpenTeamForm}
                            activeTeam={activeTeam}
                            setActiveTeam={setActiveTeam}
                            tab={teamTab}
                            company={company}
                            setTab={setTeamTab}
                            setTeamSidebar={setTeamSidebar}
                            teamSidebar={teamSidebar}
                            notify={notify}
                        />
                    )}
                </div>
                <div>
                    {tab === "roles" && (
                        <Roles
                            permissionsList={rolesPermissions}
                            activeRole={activeRole}
                            setActiveRole={setActiveRole}
                            newRole={newRole}
                            setNewRole={setNewRole}
                            defaultRoles={defaultRoles}
                            legacyRoles={legacyRoles}
                            company={company}
                            isImpersonate={isImpersonate}
                            canViewRol={canViewRol}
                            canUpdateRol={canUpdateRol}
                            canDeleteRol={canDeleteRol}
                            notify={notify}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersAdmin;
