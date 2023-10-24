import { Modal } from "@apps/shared/common";
import { Circle } from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import Filters from "../../common/Filters";
import DeleteModal from "./DeleteRole";
import RoleModal from "./Permissions/RoleModal";
import RolesTable from "./RolesTable";

import { SimpleRowSkeleton } from "@apps/shared/common";
import { useSelector } from "react-redux";
const INITIAL_FILTERS = { roleName: "", state: [] };

const Roles = (props) => {
    const { permissionsList, newRole, setNewRole, defaultRoles, legacyRoles, company, isImpersonate, canDeleteRol, canUpdateRol, notify } = props;
    const [openForm, setOpenForm] = useState(false);
    const [activeRole, setActiveRole] = useState({});
    const [desactivate, setDesactivate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [nrows, setRows] = useState(10);
    const [pageLimit, setPageLimit] = useState(1);
    const [maxPage, setMaxPage] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState(INITIAL_FILTERS);
    const [companyPermissions, setCompanyPermissions] = useState([]);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [errors, setErrors] = useState("");
    const companyId = get(company, "id");
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const [query, setQuery] = useState("");
    const [loadingQuery, setLoadingQuery] = useState(false);
    const { t } = useTranslation();
    const ref = useRef();
    const viewPermission = !!permissionsList.find((data) => data.startsWith("rol:"));
    const deletePermission = !!permissionsList.find((data) => data === "rol:delete_rol");
    const editPermission = !!permissionsList.find((data) => data === "rol:update_rol");

    const companyMaster = localStorage.getItem("company-master");

    let loadingSkeleton = [];

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

    const onChangeState = (status) => {
        setSelectedOptions({ ...selectedOptions, state: status });
    };

    const clearState = () => {
        setSelectedOptions({ ...selectedOptions, state: [] });
    };

    const rolesFilters = [
        {
            name: t("AdminFilters.state"),
            options: activeOptions,
            value: selectedOptions.state,
            onChange: onChangeState,
            clear: clearState,
            icon: <Circle width="0.75rem" fill="white" />,
        },
    ];

    useEffect(() => {
        if (newRole) {
            setActiveRole(null);
            setOpenForm(true);
        }
    }, [newRole]);

    useEffect(() => {
        if (!openForm) {
            setNewRole(false);
        }
    }, [openForm]);

    const loadPermissions = async () => {
        try {
            const resp = await DashboardServer.get(`/modules/permissions`, {
                params: {
                    shouldPaginate: false,
                },
            });
            const { data } = resp;
            let array = data.data.results;
            const formatted = [];
            array.forEach((module) => {
                Number(companyId) === 135 || Number(companyId) === 5 || Number(companyMaster) === 135 || Number(companyMaster) === 5
                    ? formatted.push({
                          id: module.moduleId,
                          value: module.moduleId,
                          name: module.displayName,
                          permissions: module.permissions,
                          displayName: module.displayName,
                          displayNames: module.displayNames,
                      })
                    : module.displayName !== "Ecommerce" &&
                      formatted.push({
                          id: module.moduleId,
                          value: module.moduleId,
                          name: module.displayName,
                          permissions: module.permissions,
                          displayName: module.displayName,
                          displayNames: module.displayNames,
                      });
            });
            const orderAsc = orderBy(formatted, ["name"], ["asc"]);
            setModules(orderAsc);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const loadRoles = async (role) => {
        try {
            setLoading(true);
            let params = {};
            if (role) {
                setLoadingQuery(true);
                params = {
                    ...(role ? { query: role } : {}),
                    shouldPaginate: true,
                    ...(defaultRoles || isImpersonate ? { defaultRoles: true } : { defaultRoles: false }),
                    ...(legacyRoles || isImpersonate ? { legacyRoles: true } : { legacyRoles: false }),
                };
            } else {
                params = {
                    shouldPaginate: true,
                    limit: nrows,
                    page: pageLimit,
                    ...(defaultRoles || isImpersonate ? { defaultRoles: true } : { defaultRoles: false }),
                    ...(legacyRoles || isImpersonate ? { legacyRoles: true } : { legacyRoles: false }),
                };
            }
            if (selectedOptions !== INITIAL_FILTERS) {
                if (selectedOptions["state"].length === 1) {
                    params.state = first(selectedOptions["state"]).label;
                }
            }

            const { data } = await DashboardServer.get(`/companies/${companyId}/roles/permissions`, { params });
            const arrayTemp = get(data, "results", []);
            let array = [];

            arrayTemp.forEach((role) => {
                array.push({ ...role, value: role.id, label: role.name });
            });

            setRoles(array);
            setMaxPage(get(data, "pagination.totalPages", 1));
            setLoading(false);
            setLoadingQuery(false);
        } catch (error) {
            setLoadingQuery(false);
            setLoading(false);
            console.log(error);
        }
    };

    const onConfirmDelete = async () => {
        try {
            setLoadingFeedback(true);
            await DashboardServer.delete(`/companies/${companyId}/roles/${activeRole.id}`);
            setActiveRole(null);
            setOpen(false);
            setLoadingFeedback(false);
            notify(t("rolesForm.successDeleteRole"));
            setTimeout(() => {
                loadRoles(query);
            }, 2000);
        } catch (error) {
            console.log(error);
            const { response } = error;
            setLoading(false);
            const msg = get(response, "data.error.clientMessages", {});
            setErrors(get(msg, lang, t("registerBusiness.errorPhrase")));
            setLoadingFeedback(false);
        }
    };

    const onConfirmActivate = async () => {
        setLoading(true);
        try {
            await DashboardServer.patch(`/companies/${companyId}/roles/${activeRole.id}`, activeRole);
            setOpen(false);
            setActiveRole({});
            setTimeout(() => {
                loadRoles(query);
            }, 2000);
            notify(t("rolesForm.successActivateRole"));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteRole = (role) => {
        setActiveRole(role);
        setOpen(true);
        setDesactivate(false);
    };

    const handleRole = (role) => {
        setActiveRole(role);
        setCompanyPermissions(get(role, "list", []));
        setOpenForm(true);
    };

    useEffect(() => {
        setLoading(true);
        loadRoles();
    }, [pageLimit, nrows]);

    useEffect(() => {
        if (!isEmpty(query)) {
            setPageLimit(1);
        }
    }, [query]);

    useEffect(() => {
        setLoading(true);
        loadPermissions();
    }, []);

    useEffect(() => {
        if (!isEmpty(company)) {
            loadRoles();
        }
    }, [company]);

    for (let i = 0; i < 6; i++) {
        loadingSkeleton.push(<SimpleRowSkeleton key={i} />);
    }

    const handleActivateRole = (role) => {
        setActiveRole(role);
        setOpen(true);
        setDesactivate(true);
    };

    return (
        <>
            <ToastContainer />
            {viewPermission && (
                <>
                    <div className="mt-4 rounded-t-1 bg-white px-2">
                        <Filters
                            loadingQuery={loadingQuery}
                            setQuery={setQuery}
                            INITIAL_FILTERS={INITIAL_FILTERS}
                            filters={rolesFilters}
                            loadResults={loadRoles}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            setPageLimit={setPageLimit}
                        />
                    </div>
                    <div>
                        <RolesTable
                            loading={loading}
                            pageLimit={pageLimit}
                            setPageLimit={setPageLimit}
                            data={roles}
                            maxPage={maxPage}
                            loadRoles={loadPermissions}
                            editPermission={editPermission}
                            deletePermission={deletePermission}
                            handleDeleteRole={handleDeleteRole}
                            canDeleteRol={canDeleteRol}
                            canUpdateRol={canUpdateRol}
                            handleViewRole={handleRole}
                            nrows={nrows}
                            setRows={setRows}
                            lang={lang}
                            handleActivateRole={handleActivateRole}
                        />

                        {openForm && (
                            <div className="w-full">
                                <Modal>
                                    <RoleModal
                                        canUpdateRol={canUpdateRol}
                                        canDeleteRol={canDeleteRol}
                                        role={activeRole}
                                        setActiveRole={setActiveRole}
                                        handleRole={handleRole}
                                        setOpenForm={setOpenForm}
                                        setNewRole={setNewRole}
                                        editPermission={editPermission}
                                        loadRoles={loadRoles}
                                        modules={modules}
                                        loadPermissions={loadPermissions}
                                        permissionsList={permissionsList} //JWT permissions
                                        companyPermissions={setCompanyPermissions}
                                        setCompanyPermissions={companyPermissions}
                                    />
                                </Modal>
                            </div>
                        )}

                        {open && (
                            <div ref={ref} className="relative">
                                <Modal>
                                    <DeleteModal
                                        onConfirm={desactivate ? onConfirmActivate : onConfirmDelete}
                                        setOpen={setOpen}
                                        name={activeRole ? activeRole.name : ""}
                                        errors={errors}
                                        loading={loadingFeedback}
                                        desactivate={desactivate}
                                    />
                                </Modal>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default Roles;
