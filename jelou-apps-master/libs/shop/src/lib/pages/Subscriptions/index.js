import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionsTitle } from "../../components/ActionsTitle";
import { Pagination } from "../../components/Pagination";
import CreateSubscriptionsModal from "../../components/Subscriptions/CreateSubscriptionsModal";
import DeleteSubscriptionsModal from "../../components/Subscriptions/DeleteSubscriptionsModal";
import { Table } from "../../components/Table";
import { useEstructureColumns } from "../../hooks/estructureColumns";
import { useSubscriptions } from "../../hooks/subscriptions";

const SubscriptionsTab = () => {
    const [subscriptionsData, setSubscriptionsData] = useState(null);
    const [showCreateSubscriptionsModal, setShowCreateSubscriptionsModal] = useState(false);
    const [showDeleteSubscriptionsModal, setShowDeleteSubscriptionsModal] = useState(false);

    const { t } = useTranslation();
    const { subscriptionsColumns } = useEstructureColumns({ setData: setSubscriptionsData, setShow: setShowDeleteSubscriptionsModal });

    const { setPage, loading, dataForPage, setLimitForPage, subscriptionsList, setSubscriptionsList, setSelectedSubscriptions } = useSubscriptions();

    return (
        <div className="min-h-[17rem] rounded-xl bg-white">
            <header className="mb-8">
                <ActionsTitle
                    isSubscriptions={true}
                    setSearch={setSelectedSubscriptions}
                    title={t("shop.plans.table.title")}
                    handleOpenClick={() => setShowCreateSubscriptionsModal(true)}
                    placeholderInputSearch={t("shop.plans.table.searchPlaceholder")}
                />
            </header>

            <Suspense>
                <CreateSubscriptionsModal
                    isShow={showCreateSubscriptionsModal}
                    setSubscriptionsList={setSubscriptionsList}
                    onClose={() => setShowCreateSubscriptionsModal(false)}
                />
            </Suspense>

            <Suspense>
                <DeleteSubscriptionsModal
                    subscriptionsData={subscriptionsData}
                    isShow={showDeleteSubscriptionsModal}
                    setSubscriptionsList={setSubscriptionsList}
                    onClose={() => setShowDeleteSubscriptionsModal(false)}
                />
            </Suspense>

            <Table
                loadingTable={loading}
                EmptyTable={EmptyMessage}
                dataList={subscriptionsList}
                structureColumns={subscriptionsColumns}
                errMsg={t("shop.plans.table.getError")}
            />
            <div className="border-t-1 border-[#a6b4d0] border-opacity-25">
                {subscriptionsList.length > 0 && <Pagination setCurrentPage={setPage} dataForPage={dataForPage} setPerPage={setLimitForPage} />}
            </div>
        </div>
    );
};

function EmptyMessage() {
    const { t } = useTranslation();
    return <h3 className="mt-4 text-center text-xl font-bold text-gray-400 text-opacity-75">{t("shop.plans.empty")}</h3>;
}

export default SubscriptionsTab;
