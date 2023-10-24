import { MultiLangSelect, ReactSelect } from "@apps/shared/common";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Permissions from "./PermissionsForm";

const ModuleDetail = (props) => {
    const { role, modules, lang, filteredModules, setFilteredModules, canUpdateRol, element, companyPermissions, setCompanyPermissions, elements, setElements } = props;

    const lock = get(role, "default");
    const { t } = useTranslation();
    const [roleSelected, setRoleSelected] = useState(modules.find((mod) => Number(mod.id) === Number(element.id)));
    // const [moduleLangList, setModuleLangList]
    const onChangeModule = (rol) => {
        const permissions = get(rol, "permissions", []);
        const index = elements.indexOf(element);
        let newArray = elements;
        newArray[index] = {
            ...newArray[index],
            moduleId: rol.id,
            permissionList: permissions,
        };
        setElements([...newArray]);
        setFilteredModules((old) => old.filter((obj) => obj.value !== rol.id));
        setRoleSelected(rol);
    };

    return (
        <div className="w-full">
            <div className="w-full justify-between py-1">
                <div className="relative flex w-full items-center space-x-2 text-sm text-gray-400">
                    <div className="block text-15 font-bold text-gray-400">{t("rolesPermissionModules.modules")}</div>
                    <MultiLangSelect
                        options={filteredModules}
                        className="w-full"
                        value={roleSelected ? { ...roleSelected, label: isEmpty(roleSelected.displayNames) ? get(roleSelected, "displayName", "") : roleSelected.displayNames[lang] } : ""}
                        name="modules"
                        isDisabled={lock || !canUpdateRol}
                        search
                        placeholder={t("rolesPermissionModules.placeholder")}
                        onChange={onChangeModule}
                    />
                </div>
            </div>

            <Permissions element={element} lock={lock} lang={lang} canUpdateRol={canUpdateRol} companyPermissions={companyPermissions} setCompanyPermissions={setCompanyPermissions} />
        </div>
    );
};
export default ModuleDetail;
