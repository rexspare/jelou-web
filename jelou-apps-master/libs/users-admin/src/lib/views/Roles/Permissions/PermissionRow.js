import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Switch from "react-switch";

const PermissionRow = (props) => {
    const { permission, companyPermissions, setCompanyPermissions, lock, canUpdateRol, lang } = props;
    const [checkedPermission, setCheckedPermission] = useState(false);
    const company = useSelector((state) => state.company);
    const companyId = get(company, "id");
    const companyMaster = localStorage.getItem("company-master");
    const isMasterUser = !!(Number(companyId) === 135 || Number(companyId) === 5 || Number(companyMaster) === 135 || Number(companyMaster) === 5);
    const hide = !!(!isMasterUser && !lock && (permission.id === 123 || permission.id === 128));

    useEffect(() => {
        if (!isEmpty(companyPermissions)) {
            const active = !!companyPermissions.find((data) => data === permission.id);
            setCheckedPermission(active);
        }
    }, [companyPermissions, permission]);

    const handleChangeSw = (checked) => {
        setCheckedPermission(checked);
        if (checked) {
            setCompanyPermissions((currentCompanyPermissions) => [...currentCompanyPermissions, permission.id]);
        } else {
            setCompanyPermissions((currentCompanyPermissions) => {
                return currentCompanyPermissions.filter((permissionId) => permissionId !== permission.id )
            });
        }
    };
    if (!hide) {
        return (
            <div className="flex w-full items-center " key={`row-${permission.id}`}>
                <div className="relative w-24 p-3">
                    <Switch
                        id={`sw-${permission.id}`}
                        checked={checkedPermission}
                        onChange={handleChangeSw}
                        onColor="#00B3C7"
                        disabled={lock || !canUpdateRol}
                        onHandleColor="#ffffff"
                        // handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={22}
                        width={41}
                        className="react-switch"
                    />
                </div>
                <label htmlFor={`sw-${permission.id}`} className="flex w-full text-15 font-bold text-gray-400 text-opacity-75 hover:cursor-pointer">
                    {isEmpty(permission.displayNames) ? permission.displayName : permission.displayNames[lang]}
                </label>
            </div>
        );
    } else {
        return <div></div>;
    }
};

export default PermissionRow;
