import { useSelector } from "react-redux";
import { createContext, useContext, useEffect, useState } from "react";

import { usePrevious } from "@apps/shared/hooks";

import isEmpty from "lodash/isEmpty";
import { ChatManagerContext } from "@apps/pma/context";
import get from "lodash/get";
export const MonitoringContext = createContext();

const Layout = (props) => {
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const isOperator = get(userSession, "isOperator", false);
    const [pusher, setPusher] = useState(null);
    const prevCompany = usePrevious(company);
    const { pusherGlobalInstance } = useContext(ChatManagerContext);
    useEffect(() => {
        if (!isEmpty(pusherGlobalInstance) && company.socketId) {
            pusherGlobalInstance.subscribe(`channel-company-${company.socketId}`);

            setPusher(pusherGlobalInstance);
        }
        return () => {
            if (!isEmpty(pusherGlobalInstance) && company.socketId && !isOperator) {
                pusherGlobalInstance.unsubscribe(`channel-company-${company.socketId}`);
            }
        };
    }, [company, pusherGlobalInstance]);

    const unsubscribe = (company) => {
        try {
            pusherGlobalInstance.unsubscribe(`channel-company-${company.socketId}`);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!isEmpty(prevCompany) && !isEmpty(pusher)) {
            unsubscribe(prevCompany);
        }
    }, [company, pusherGlobalInstance]);

    return (
        <div>
            <MonitoringContext.Provider value={{ pusher }}>{props.children}</MonitoringContext.Provider>
        </div>
    );
};

export default Layout;
