import { LoadingSpinner } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const ModalFooter1 = ({ closeModal, loading, disableButton = false, isEditing, primaryText, className = "", primaryAction }) => {
    const { t } = useTranslation();

    if (!primaryText) {
        primaryText = isEditing ? t("common.update") : t("common.create");
    }

    return (
        <footer className={`${className} mt-auto mb-0 flex items-center justify-end gap-x-3`}>
            <button disabled={loading} onClick={closeModal} className="h-9 w-28 rounded-3xl bg-gray-10 font-bold text-gray-400">
                {t("common.cancel")}
            </button>
            <button
                onClick={primaryAction}
                disabled={loading || disableButton}
                className="min-w-fit button-primary flex h-9 w-28 items-center justify-center px-5">
                {loading ? <LoadingSpinner /> : primaryText}
            </button>
        </footer>
    );
};

export default ModalFooter1;
