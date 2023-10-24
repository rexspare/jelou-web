import React from "react";
import includes from "lodash/includes";
import { GridLoader } from "react-spinners";
import { isEmpty } from "lodash";

const AccessControl = (props) => {
    const { renderNoAccess, allowedPermission, permissions } = props;
    const token = localStorage.getItem("jwt");
    if (isEmpty(permissions)) {
        return (
            <div>
                <div className="m-auto flex h-screen w-full max-w-6xl items-center justify-center">
                    <GridLoader color={"#00B3C7"} size={15} />
                </div>
            </div>
        );
    }
    if (!token) {
        return props.children;
    }
    if (allowedPermission && includes(permissions, allowedPermission)) {
        return props.children;
    }
    if (!renderNoAccess) {
        return null;
    }

    return renderNoAccess();
};

export default AccessControl;
