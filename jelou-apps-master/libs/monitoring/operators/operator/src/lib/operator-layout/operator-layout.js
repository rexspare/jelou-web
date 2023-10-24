import { useContext, useEffect, useState } from "react";

import { usePrevious } from "@apps/shared/hooks";

import isEmpty from "lodash/isEmpty";
import { useLocation } from "react-router-dom";
import { ChatManagerContext } from "@apps/pma/context";
import { useSelector } from "react-redux";

const OperatorLayout = (props) => {
    // const company = useSelector((state) => state.company);
    const [pusher, setPusher] = useState(null);
    const { state } = useLocation();
    let { user = {} } = state;
    const company = useSelector((state) => state.company);

    const prevUser = usePrevious(user);
    const { pusherGlobalInstance } = useContext(ChatManagerContext);
    useEffect(() => {
        if (pusherGlobalInstance) {
            setPusher(pusherGlobalInstance);
        }
    }, [user, company, pusherGlobalInstance]);

    const unsubscribe = (user) => {
        try {
            pusher.unsubscribe(`socket-${user.providerId}`);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!isEmpty(prevUser)) {
            unsubscribe(prevUser);
        }
    }, [user]);

    // useEffect(() => {
    //     const OneSignal = window.OneSignal || [];
    //     OneSignal.push(function () {
    //         OneSignal.init({
    //             appId: "d3d7245c-2cbc-4e05-8a6d-7898eff85855",
    //         });
    //     });
    // }, []);

    return <div>{props.children}</div>;
};

export default OperatorLayout;
