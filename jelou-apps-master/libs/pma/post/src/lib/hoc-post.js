import React, { useContext, useEffect } from "react";
import get from "lodash/get";
import { ChatManagerContext } from "@apps/pma/context";

const withSubscription = (WrappedComponent) => {
    return (props) => {
        const { chatManager: context } = useContext(ChatManagerContext);

        useEffect(() => {
            if (context) {
                const companySocketId = get(context, "settings.companySocketId", "");
                const channel = context.channel;

                const pusher = channel?.pusher;

                channel.subscribeToQueues({ companySocketId });

                channel.bindQueueEvents({ pusher, companySocketId });
            }

            return () => {
                if (context) {
                    const channel = context.channel;
                    const companySocketId = get(context, "settings.companySocketId", "");
                    channel.unbindQueueEvents({ companySocketId });
                }
            };
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withSubscription;
