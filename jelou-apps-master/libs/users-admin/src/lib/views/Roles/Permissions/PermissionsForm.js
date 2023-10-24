import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import PermissionRow from "./PermissionRow";

const Permissions = (props) => {
    const { companyPermissions, setCompanyPermissions, lock, element, canUpdateRol, lang } = props;
    const [permissionList, setPermissionList] = useState(get(element, "permissionList", []));

    useEffect(() => {
        setPermissionList(get(element, "permissionList", []));
    }, [element]);

    return (
        <div className="flex-1 py-4">
            {!isEmpty(permissionList) && (
                <>
                    {permissionList.map((permission) => (
                        <PermissionRow
                            permission={permission}
                            companyPermissions={companyPermissions}
                            setCompanyPermissions={setCompanyPermissions}
                            key={permission.id}
                            lock={lock}
                            canUpdateRol={canUpdateRol}
                            lang={lang}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default Permissions;
