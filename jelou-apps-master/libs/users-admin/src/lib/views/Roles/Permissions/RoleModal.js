/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "@apps/shared/common";
import { useOnClickOutside } from "@apps/shared/hooks";
import { CloseIcon } from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";
import Tippy from "@tippyjs/react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import ModuleDetail from "./ModuleDetail";
import { useEventTracking } from "@apps/shared/hooks";
import CircularProgress from "@builder/common/CircularProgressbar";

const RoleModal = (props) => {
    const { role, setOpenForm, setActiveRole, loadRoles, modules, editPermission, handleRole, setNewRole, canUpdateRol, canDeleteRol } = props;
    const company = useSelector((state) => state.company);
    const companyId = get(company, "id");
    const [companyPermissions, setCompanyPermissions] = useState(get(role, "list", []));
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(get(role, "name", ""));
    const [filteredModules, setFilteredModules] = useState([...modules]);
    const [errors] = useState("");
    const lock = get(role, "default");
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const moduleRef = useRef();
    const { t } = useTranslation();
    const trackEvent = useEventTracking();

    const MINIMUM_CHARACTERS = 2;
    const MAXIMUM_CHARACTERS = 70;

    const renderErrors = (errors, t) => {
        if (!isEmpty(errors)) {
            return <span className="text-xs font-normal text-red-675">{errors}</span>;
        }
    };

    const handleClose = () => {
        setNewRole(false);
        setOpenForm(false);
        setActiveRole(null);
    };

    useOnClickOutside(moduleRef, () => setOpenForm(false));

    useEffect(() => {
        if (!isEmpty(role)) {
            const modulesList = get(role, "modules", []);
            const formattedModules = [];
            modulesList.forEach((obj) => {
                const module = obj.toString();
                const moduleDefault = modules.find((obj) => obj.value === module);
                !isEmpty(get(moduleDefault, "permissions", [])) &&
                    formattedModules.push({
                        id: module,
                        moduleId: module,
                        permissionList: get(moduleDefault, "permissions", []),
                    });
            });
            setElements(formattedModules);
        }
    }, [role]);

    const handleChange = ({ target }) => {
        setName(target.value);
    };

    const isValidName = name.length >= MINIMUM_CHARACTERS && name.length <= MAXIMUM_CHARACTERS;
    const showError = name.length > 0 && !isValidName;

    const handleElementDelete = (elementId) => {
        setElements((elements) => elements.filter((item) => item.id !== elementId));
        const elementToRemove = elements.find((item) => item.id === elementId);
        const permissionsToRemove = get(elementToRemove, "permissionList", []).map((permission) => permission.id);
        const filteredPermissions = companyPermissions.filter((companyPermissionId) => {
            return !permissionsToRemove.includes(companyPermissionId);
        });
        setCompanyPermissions(filteredPermissions);
    };

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

    const notifyError = (error) => {
        toast.error(
            <div className="relative flex items-center justify-between">
                <div className="flex">
                    <div className="text-15">{error}</div>
                </div>

            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    };

    const handleAddElement = () => {
        const id = uuid();
        setElements((currentElements) => [...currentElements, { id }]);
    };

    const createRole = async (obj) => {
        setLoading(true);

        trackEvent("Role Created");

        try {
            const resp = await DashboardServer.post(`/companies/${companyId}/roles`, obj);
            const { data } = resp;
            loadRoles();
            handleRole(data.data);
            //  setIdFocus(data.data.id);
            notify(t("rolesForm.successCreateRole"));
            setOpenForm(false);
            setActiveRole({});
            setLoading(false);
        } catch (error) {
            console.log(error);
            const { response } = error;
            setLoading(false);
            const msg = get(response, "data.error.clientMessages", {});
            notifyError(get(msg, lang, t("registerBusiness.errorPhrase")));
            setLoading(false);
        }
    };

    const editRole = async (obj) => {
        setLoading(true);
        try {
            const resp = await DashboardServer.patch(`/companies/${companyId}/roles/${role.id}`, obj);
            const { data } = resp;
            setName("");
            loadRoles();
            handleRole(data.data);
            //  setIdFocus(data.data.id);
            notify(t("rolesForm.successEditRole"));
            setOpenForm(false);
            setLoading(false);
        } catch (error) {
            console.log(error);
            const { response } = error;
            setLoading(false);
            const msg = get(response, "data.error.clientMessages", {});
            notifyError(get(msg, lang, t("registerBusiness.errorPhrase")));
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const modulesObj = {
            name,
            permissions: companyPermissions,
        };

        if (!isEmpty(role)) {
            editRole(modulesObj);
        } else {
            createRole(modulesObj);
        }
    };


    return (
        <div className="fixed inset-x-0 top-0 z-120 sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className="w-[35%] transform rounded-20 bg-white py-6 shadow-outline-modal transition-all" ref={moduleRef}>
                <div className="max-h-modal overflow-scroll px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="max-w-md font-bold text-gray-400">
                                {!isEmpty(role) ? (role.default ? `${t("AdminFilters.viewRole")} ${role.name}` : `${t("AdminFilters.viewEditRole")} ${role.name}`) : t("AdminFilters.createRole")}
                            </div>
                        </div>
                        <button onClick={handleClose}>
                            <CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />
                        </button>
                    </div>
                    <div className="relative pt-4">
                        <form onSubmit={handleSubmit} method="POST" name="formUser" action="">
                            <div className="flex w-full items-start space-x-6 py-2">
                                <label htmlFor="nombre" className="max-w-xxxs flex-1 mx-2">
                                    <div className="mb-1 block text-center text-sm font-bold text-gray-400 text-opacity-75">{t("rolesForm.name")}</div>
                                </label>
                                <div className={showError ? 'flex flex-col w-full': ' flex flex-col w-full items-end'}>
                                    <Input
                                        className={`flex-1 rounded-xs h-34 px-2 !text-15 outline-none text-gray-400 w-full bg-primary-700 ring-transparent focus:ring-transparent  ${showError ? 'border-semantic-error focus:border-red-500' : 'focus:border-transparent border-transparent'}`}
                                        id="nombre"
                                        type="text"
                                        key={`${role ? "r-" + role.id : "r-0"}`}
                                        disabled={role && (role.default === 1 || role.default === true || editPermission === false) ? true : false}
                                        required={true}
                                        name="name"
                                        onChange={handleChange}
                                        defaultValue={name}
                                        maxLength={MAXIMUM_CHARACTERS}
                                    />
                                    <div className="flex items-center justify-between mt-1">
                                        {showError && (
                                            <p className="w-full break-words text-xs text-semantic-error">
                                                {`${t("common.mustHaveAlLeast")} ${MINIMUM_CHARACTERS} ${t("common.characters")}`}
                                            </p>
                                        )}
                                        <CircularProgress
                                            MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                                            MAXIMUM_CHARACTERS={MAXIMUM_CHARACTERS}
                                            countFieldLength={(name && name.length) ? name.length : 0}
                                            showProgressbar={true}
                                            showError={showError}
                                        />
                                    </div>
                                </div>

                            </div>
                            {elements.map((element, index) => (
                                <div className="mt-3 flex space-x-2 py-3" key={index}>
                                    <div className="flex-1 rounded-xl border-default border-gray-lighter px-4 py-3">
                                        <ModuleDetail
                                            canUpdateRol={canUpdateRol}
                                            role={role}
                                            filteredModules={filteredModules}
                                            setFilteredModules={setFilteredModules}
                                            modules={modules}
                                            handleElementDelete={handleElementDelete}
                                            element={element}
                                            elements={elements}
                                            setElements={setElements}
                                            companyPermissions={companyPermissions}
                                            setCompanyPermissions={setCompanyPermissions}
                                            lang={lang}
                                        />
                                    </div>
                                    {!lock && canDeleteRol && (
                                        <div className="flex">
                                            <Tippy content={t("botsSettingsCategoriesSidebarElement.deleteElement")} placement={"top"} touch={false}>
                                                <div>
                                                    <button type="button" onClick={() => handleElementDelete(element.id)}>
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M0.310725 10.3107L1.68928 11.6893L6 7.37855L10.2998 11.6783L11.6783 10.2998L7.37856 5.99999L11.6893 1.68927L10.3107 0.310719L6 4.62144L1.68928 0.310719L0.310725 1.68927L4.62144 5.99999L0.310725 10.3107Z"
                                                                fill="#727C94"
                                                                fillOpacity="0.5"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </Tippy>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {!lock && editPermission && (
                                <div className="mt-4 block">
                                    <button className="font-bold text-primary-200" type="button" onClick={handleAddElement}>
                                        {`+ ${t("rolesForm.add")}`}
                                    </button>
                                </div>
                            )}

                            {!isEmpty(errors) && <div className="mt-2 text-right">{renderErrors(errors)}</div>}
                            {!lock && editPermission && (
                                <div className="mt-12 flex w-full flex-col justify-start md:flex-row">
                                    <div className="mt-6 inline-flex w-full text-center md:mt-0">
                                        <button type="submit" className="button-primary w-32" disabled={loading || !isValidName || (isEmpty(companyPermissions))}>
                                            {loading ? <BeatLoader color={"white"} size={"0.625rem"} /> : `${t("rolesForm.save")}`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
    
};

export default RoleModal;
