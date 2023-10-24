import { ModalHeadless } from "@apps/shared/common";

import { useTranslation } from "react-i18next";

const SavePriceModal = ({ closeModal, isShow, handleContinueAction }) => {
    const { t } = useTranslation();

    return (
        <ModalHeadless
            isShowModal={isShow}
            closeModal={closeModal}
            className="inline-block h-48 w-[35rem] max-w-xl transform overflow-hidden rounded-20 bg-white pl-8 text-left align-middle font-semibold text-gray-400 shadow-xl transition-all"
        >
            <section className="pr-8">
                <p className="mb-2 text-xl font-normal text-primary-200">{t("shop.prices.saveModal.title")}</p>
                <p className="text-base font-bold text-gray-400">{t("shop.prices.deleteModalSubtitle")}</p>
                <footer className="flex h-12 items-center justify-end gap-4 bg-white">
                    <button type="button" onClick={closeModal} className="rounded-3xl border-transparent bg-gray-10 px-5 py-2 text-base font-bold text-gray-400 outline-none">
                        {t("shop.prices.saveModal.return")}
                    </button>
                    <button type="button" onClick={handleContinueAction} className="button-gradient-xl disabled:cursor-not-allowed disabled:bg-opacity-60">
                        {t("shop.prices.saveModal.continue")}
                    </button>
                </footer>
            </section>
        </ModalHeadless>
    );
};

export default SavePriceModal;
