import { t } from "i18next";

import { LoadingSpinner } from "@apps/shared/icons";

export const FooterBtns = ({ closeModal, loading, labelBtnSecondary = t("shop.modal.cancel"), labelBtnPrincipal = t("buttons.save") }) => {
    return (
        <footer className="flex justify-end gap-4 py-4">
            <button
                type="button"
                onClick={closeModal}
                className="rounded-3xl border-transparent bg-gray-10 px-5 py-2 text-base font-bold text-gray-400 outline-none">
                {labelBtnSecondary}
            </button>
            <button disabled={loading} type="submit" className="button-gradient-xl disabled:cursor-not-allowed disabled:bg-opacity-60">
                {loading ? (
                    <div className="flex justify-center">
                        <LoadingSpinner color="#fff" />
                    </div>
                ) : (
                    labelBtnPrincipal
                )}
            </button>
        </footer>
    );
};
