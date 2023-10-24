import get from "lodash/get";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { createSubscriptions, deleteSubscriptionService } from "../../services/subscriptions";

export function useSubscriptionsActions({ setSubscriptionsList, onClose = () => null } = {}) {
    
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const company = useSelector((state) => state.company);
    const { app_id = null, bearer_token = null } = get(company, "properties.shopCredentials.jelou_pay", {});

    const create = ({ dataForm }) => {
        if (!app_id || !bearer_token) {
            console.error("hook - useSubscriptions - create - credentials", { app_id, bearer_token });
            renderMessage(
                t("shop.plans.create.error"),
                MESSAGE_TYPES.ERROR
            );
            return;
        }

        setLoading(true);

        createSubscriptions({ app_id, dataForm, bearer_token })
            .then((data) => {
                renderMessage(t("shop.plans.create.success"), MESSAGE_TYPES.SUCCESS);
                setSubscriptionsList((preState) => [data, ...preState]);
            })
            .catch((error) => {
                console.error("hook - useSubscriptions - create - error", { error });
                renderMessage(error, MESSAGE_TYPES.ERROR);
            })
            .finally(() => {
                setLoading(false);
                onClose();
            });
    };

    const deleteSubscription = ({ subscription_id }) => {
        if (!app_id || !subscription_id || !bearer_token) {
            console.error("hook - useSubscriptions - deleteCategory - credentials", { app_id, subscription_id, bearer_token });
            renderMessage(
                t("shop.plans.create.error"),
                MESSAGE_TYPES.ERROR
            );
            return;
        }

        setLoading(true);

        deleteSubscriptionService({ app_id, subscription_id, bearer_token })
            .then(() => {
                renderMessage(t("shop.plans.delete.success"), MESSAGE_TYPES.SUCCESS);
                setSubscriptionsList((preState) => preState.filter((item) => item.id !== subscription_id));
            })
            .catch((error) => {
                console.error("hook - useSubscriptions - deleteSubscription - error", { error });
                renderMessage(error, MESSAGE_TYPES.ERROR);
            })
            .finally(() => {
                setLoading(false);
                onClose();
            });
    };

    return { create, deleteSubscription, loading };
}
