import { useTranslation } from "react-i18next";
import { useState } from "react";

import { ModalHeadless, renderMessage } from "@apps/shared/common";
import { deletePriceOfProduct } from "../../services/prices";
import { LoadingSpinner } from "@apps/shared/icons";
import { MESSAGE_TYPES } from "@apps/shared/constants";

import { useContext } from "react";
import PriceContext from "./PriceContext";

export default function DeletePriceModal({ isShow, priceId, productId, closeModal, handleDeletePrice: handleDeleteLocalPrice }) {
    const { refreshPriceList } = useContext(PriceContext);
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();

    const handleDeletePrice = () => {
        setLoading(true);
        deletePriceOfProduct(productId, priceId)
            .then(() => {
                handleDeleteLocalPrice(priceId);
                renderMessage(t("shop.prices.deletePriceSuccess"), MESSAGE_TYPES.SUCCESS);
            })
            .catch((errorMessage) => renderMessage(errorMessage, MESSAGE_TYPES.ERROR))
            .finally(() => {
                refreshPriceList(productId);
                setLoading(false);
                closeModal();
            });
    };

    return (
        <ModalHeadless
            className="relative inline-block h-48 w-[35rem] max-w-xl transform overflow-hidden rounded-20 bg-white pl-8 text-left align-middle font-semibold text-gray-400 shadow-xl transition-all"
            closeModal={closeModal}
            isShowModal={isShow}
        >
            <section className="pr-8">
                <p className="mb-2 text-xl font-normal text-primary-200">{t("shop.prices.deleteModalTitle")}</p>
                <p className="text-base font-bold text-gray-400">{t("shop.prices.deleteModalSubtitle")}</p>
                <footer className="flex h-12 items-center justify-end gap-4 bg-white">
                    <button type="button" onClick={closeModal} className="rounded-3xl border-transparent bg-gray-10 px-5 py-2 text-base font-bold text-gray-400 outline-none">
                        {t("buttons.cancel")}
                    </button>
                    <button onClick={handleDeletePrice} disabled={loading} type="button" className="button-gradient-xl disabled:cursor-not-allowed disabled:bg-opacity-60">
                        {loading ? (
                            <div className="flex justify-center">
                                <LoadingSpinner color="#fff" />
                            </div>
                        ) : (
                            t("buttons.delete")
                        )}
                    </button>
                </footer>
            </section>
        </ModalHeadless>
    );
}
