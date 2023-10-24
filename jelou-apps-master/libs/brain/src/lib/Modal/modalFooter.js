import { useTranslation } from "react-i18next";

import { LoadingSpinner } from "@apps/shared/icons";
import { TYPES_CHANNEL } from "libs/bots/ui-shared/src/lib/modal/contants";

const ModalFooter = (props) => {
    const {
        closeModal,
        loading,
        disableButton = false,
        isEditing,
        primaryText,
        className = "",
        instagramRequirementsView = false,
        setInstagramRequirementsView = () => {},
        channelSelected = {},
        showChannelTypeCarousel = false
    } = props;
    const { t } = useTranslation();

    const textButton = primaryText ?? (isEditing ? t("common.update") : t("common.create"));

    return (
        <footer className={`${className} mt-auto mb-0 flex items-center justify-end gap-x-3`}>
            <button
                type="reset"
                disabled={loading}
                onClick={closeModal}
                className="h-9 w-28 rounded-3xl bg-gray-10 font-bold text-gray-400"
            >
                {t("common.cancel")}
            </button>
            {instagramRequirementsView && channelSelected.id === TYPES_CHANNEL.INSTAGRAM && !showChannelTypeCarousel ?
                <button
                    className="min-w-fit button-primary flex h-9 w-28 items-center justify-center px-5"
                    onClick={() =>{ setInstagramRequirementsView(false) }}
                >
                    {t("common.continue")}
                </button>
            :
                <button
                    type="submit"
                    disabled={loading || disableButton}
                    className="min-w-fit button-primary flex h-9 w-28 items-center justify-center px-5"
                >
                    {loading ? <LoadingSpinner /> : textButton}
                </button>
            }
        </footer>
    );
};

export default ModalFooter;
