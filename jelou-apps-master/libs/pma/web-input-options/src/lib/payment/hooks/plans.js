import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { renderMessage } from "@apps/shared/common";
import { getPaymentsPlans } from "../service/paymentPlans";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export function usePaymentsPlans() {
    const [plans, setPlans] = useState([]);
    const company = useSelector((state) => state.company);

    const getPlans = useCallback(async () => {
        const { jelou_pay = {} } = company?.properties?.shopCredentials || {};
        const { app_id = null, bearer_token = null } = jelou_pay;

        if (!app_id || !bearer_token) return;

        getPaymentsPlans({ app_id, bearer_token })
            .then(setPlans)
            .catch((error) => {
                renderMessage(String(error?.message || error), MESSAGE_TYPES.ERROR);
            });
    }, [company]);

    useEffect(() => {
        getPlans();
    }, []);

    return { plans };
}
