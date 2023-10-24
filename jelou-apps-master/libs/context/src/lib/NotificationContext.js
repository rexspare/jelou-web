import { createContext, useEffect } from "react";
import { useSelector } from "react-redux";

import { NotificationUpdate } from "@apps/shared/common";
import { useNotification } from "@apps/shared/hooks";

export const NotificationContext = createContext(null);

const NotificationProvider = ({ children }) => {
    const { newVersion, setNewVersion, consultCurrentVersion, consultingVersion, optionsToast, toast } = useNotification();
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);

    useEffect(() => {
        let res = {};
        res = consultCurrentVersion();
        setInterval(async () => {
            consultingVersion(await res);
        }, 30000);
    }, [userSession]);

    const showToast = () => {
        const isExist = document.getElementById("isExist");
        const companyId = company.id;
        // const enableCompany = companyId === 5 || companyId === 135 || companyId === 462 || companyId === 155;
        // if (!isExist && enableCompany) {
        if (!isExist && companyId !== 35) {
            toast.warn(
                <NotificationUpdate
                    setOff={() => {
                        setNewVersion(false);
                        toast.dismiss();
                    }}
                />,
                optionsToast
            );
        }
    };

    return (
        <NotificationContext.Provider value={{}}>
            {newVersion ? showToast() : null}
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
