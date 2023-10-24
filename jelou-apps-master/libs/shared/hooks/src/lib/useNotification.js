import { JelouApiV1 } from "@apps/shared/modules";
import { useState } from "react";
import { toast, Zoom } from "react-toastify";

const useNotification = () => {
    const [newVersion, setNewVersion] = useState(false);

    const consultCurrentVersion = async () => {
        try {
            return await JelouApiV1.get("/apps_version_control/version");
        } catch (error) {
            console.log();
        }
    };

    const consultingVersion = async (currentVersion) => {
        try {
            const res = await JelouApiV1.get("/apps_version_control/version");
            const isUpdate = currentVersion.data.data.version < res.data.data.version; // current , new
            setNewVersion(isUpdate);
        } catch (error) {
            console.log();
        }
    };
    const customId = "isExist";

    const optionsToast = {
        position: "bottom-right",
        autoClose: false,
        transition: Zoom,
        closeButton: false,
        closeOnClick: false,
        bodyStyle: {
            margin: "-8px",
            padding: 0,
            display: "block",
            borderRadius: "10px",
        },
        hideProgressBar: false,
        draggable: false,
        style: {
            // width: "2xl:w-[24vw]",
            // height: "25vh",
            bottom: "-14px",
            borderRadius: "10px",
            cursor: "default",
        },
        toastId: customId,
    };

    return {
        newVersion,
        setNewVersion,
        optionsToast,
        consultCurrentVersion,
        consultingVersion,
        toast,
    };
};

export default useNotification;
