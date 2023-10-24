import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Emitter } from "@apps/shared/modules";
import { MonitoringContext } from "@apps/monitoring/index/layout";

const BindingLiveEvents = (props) => {
    const company = useSelector((state) => state.company);

    const monitoringContext = useContext(MonitoringContext);

    const pusherSocket = get(monitoringContext, "pusher", "");

    useEffect(() => {
        if (!isEmpty(company) && !isEmpty(pusherSocket)) {
            pusherSocket.bind("support-tickets-new", (payload) => {
                Emitter.emit("support-tickets-new", payload);
            });

            pusherSocket.bind("support-tickets-update", (payload) => {
                Emitter.emit("support-tickets-update", payload);
            });

            pusherSocket.bind("support-tickets-totals", (payload) => {
                Emitter.emit("support-tickets-totals", payload);
            });

            pusherSocket.bind("support-tickets-stats", (payload) => {
                Emitter.emit("support-tickets-stats", payload);
            });

            pusherSocket.bind("support-tickets-assign", (payload) => {
                Emitter.emit("support-tickets-assign", payload);
            });

            pusherSocket.bind("support-tickets-not-assigned", (payload) => {
                Emitter.emit("support-tickets-not-assigned", payload);
            });

            pusherSocket.bind("conversation-totals", (payload) => {
                Emitter.emit("conversation-totals", payload);
            });

            pusherSocket.bind("new_ticket", (payload) => {
                Emitter.emit("conversation_new_ticket", payload);
            });

            pusherSocket.bind("update_ticket", (payload) => {
                Emitter.emit("conversation_update_ticket", payload);
            });

            pusherSocket.bind("conversation_not_attended_update", (payload) => {
                Emitter.emit("conversation_not_attended_update", payload);
            });

            pusherSocket.bind("conversation_not_attended_new", (payload) => {
                Emitter.emit("conversation_not_attended_new", payload);
            });

            pusherSocket.bind("conversation-first-response", (payload) => {
                Emitter.emit("conversation-first-response", payload);
            });

            pusherSocket.bind("conversation-end", (payload) => {
                Emitter.emit("conversation-end", payload);
            });

            pusherSocket.bind("conversation-start", (payload) => {
                Emitter.emit("conversation-start", payload);
            });

            //replies or posts

            // queue replies
            pusherSocket.bind("new_ticket", (payload) => {
                Emitter.emit("new_ticket", payload);
            });

            // queue update replies
            pusherSocket.bind("update_ticket", (payload) => {
                Emitter.emit("update_ticket", payload);
            });

            pusherSocket.bind("replies-totals-stats", (payload) => {
                Emitter.emit("replies-totals-stats", payload);
            });

            pusherSocket.bind("reply-new", (payload) => {
                Emitter.emit("reply-new", payload);
            });

            pusherSocket.bind("reply-update", (payload) => {
                Emitter.emit("reply-update", payload);
            });

            return () => {
                pusherSocket.unbind();
                Emitter.off("support-tickets-new");
                Emitter.off("support-tickets-update");
                Emitter.off("support-tickets-totals");
                Emitter.off("support-tickets-stats");
                Emitter.off("support-tickets-assign");
                Emitter.off("support-tickets-not-assigned");
                Emitter.off("conversation-totals");
                Emitter.off("new_ticket");
                Emitter.off("update_ticket");
                Emitter.off("conversation_not_attended_update");
                Emitter.off("conversation_not_attended_new");
                Emitter.off("conversation-first-response");
                Emitter.off("conversation-end");
                Emitter.off("conversation-start");
                //replies or posts
                Emitter.off("new_ticket");
                Emitter.off("update_ticket");
                Emitter.off("replies-totals-stats");
                Emitter.off("reply-new");
                Emitter.off("reply-update");
            };
        }
    }, [company, pusherSocket]);
    return <div>{props.children}</div>;
};

export default BindingLiveEvents;
