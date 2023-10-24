import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Emitter } from "@apps/shared/modules";
import { MonitoringContext } from "@apps/monitoring/index/layout";

const BindingOperatorsEvents = (props) => {
    const company = useSelector((state) => state.company);

    const monitoringContext = useContext(MonitoringContext);
    const pusherSocket = get(monitoringContext, "pusher", "");
    const getPayloadBySocketId = (payload) => {
        const socketId = get(payload, "socketId", "");
        if (socketId === company.socketId) {
            return payload;
        }
        return {};
    };
    useEffect(() => {
        if (!isEmpty(company) && !isEmpty(pusherSocket)) {
            pusherSocket.bind("operator-login", (payload) => {
                const payloadBySocket = getPayloadBySocketId(payload);
                Emitter.emit("operator-login", payloadBySocket);
            });

            pusherSocket.bind("operator-logout", (payload) => {
                const payloadBySocket = getPayloadBySocketId(payload);

                Emitter.emit("operator-logout", payloadBySocket);
            });

            pusherSocket.bind("operator-status-update", (payload) => {
                const payloadBySocket = getPayloadBySocketId(payload);

                Emitter.emit("operator-status-update", payloadBySocket);
            });

            pusherSocket.bind("conversation-totals", (payload) => {
                const payloadBySocket = getPayloadBySocketId(payload);

                Emitter.emit("conversation-totals", { ...payloadBySocket, type: "operators" });
            });

            pusherSocket.bind("support-tickets-totals", (payload) => {
                const payloadBySocket = getPayloadBySocketId(payload);

                Emitter.emit("support-tickets-totals", payloadBySocket);
            });

            return () => {
                pusherSocket.unbind();
                Emitter.off("operator-login");
                Emitter.off("operator-logout");
                Emitter.off("operator-status-update");
                Emitter.off("conversation-totals");
                Emitter.off("support-tickets-totals");
            };
        }
    }, [company, pusherSocket]);
    return <div>{props.children}</div>;
};

export default BindingOperatorsEvents;
