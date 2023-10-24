import { useTranslation } from "react-i18next";

import { ModalHeadless } from "@apps/shared/common";
import { useSubscriptionsActions } from "./subscriptions";

const DeleteSubscriptionsModal = ({ isShow, onClose, subscriptionsData, setSubscriptionsList }) => {
    const { t } = useTranslation();
    const { deleteSubscription, loading } = useSubscriptionsActions({ setSubscriptionsList, onClose });

    async function handleDeleteSubscription(evt) {
        evt.preventDefault();

        const { id: subscription_id } = subscriptionsData;
        deleteSubscription({ subscription_id });
    }

    return (
        <ModalHeadless
            titleModal=""
            loading={loading}
            showButtons={true}
            closeModal={onClose}
            isShowModal={isShow}
            textButtonPrimary={t("buttons.delete")}
            textButtonSecondary={t("buttons.cancel")}
            handleClickPrimaryButton={handleDeleteSubscription}
            className="inline-block h-56 w-[35rem] max-w-xl transform overflow-hidden rounded-20 bg-white pl-8 text-left align-middle font-semibold text-gray-400 shadow-xl transition-all"
        >
            <section className="mb-4 pr-8">
                <p className="mb-2 text-xl font-normal text-primary-200">
                    {t("shop.plans.delete.title")}
                    <span className="font-bold"> "{subscriptionsData?.name}" </span>
                </p>
                <p className="text-base font-bold text-gray-400">{t("shop.plans.delete.subtitle")}</p>
            </section>
        </ModalHeadless>
    );
};

export default DeleteSubscriptionsModal;
