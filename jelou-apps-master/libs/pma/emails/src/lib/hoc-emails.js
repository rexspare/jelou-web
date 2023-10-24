import React, { useContext, useEffect } from "react";
import get from "lodash/get";
import { ChatManagerContext } from "@apps/pma/context";

const withSubscription = (WrappedComponent) => {
    return (props) => {
        const { chatManager: context } = useContext(ChatManagerContext);

        useEffect(() => {
            if (context) {
                const companySocketId = get(context, "settings.companySocketId", "");
                const companyId = get(context, "settings.companyId", "");
                const channel = context.channel;

                channel.subscribeToQueues({ companySocketId });
                channel.subscribeToMessages({ companySocketId });

                channel.bindEmailsEvents({ companySocketId, companyId });
            }
            return () => {
                if (context) {
                    const channel = context.channel;
                    const companySocketId = get(context, "settings.companySocketId", "");
                    const companyId = get(context, "settings.companyId", "");
                    channel.unbindEmailsEvents({ companySocketId, companyId });
                }
            };
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withSubscription;
