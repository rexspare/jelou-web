import { useTranslation } from "react-i18next";
import { SpinnerBrainIcon } from "@apps/shared/icons";
const CardsLoading = () => {
    const { t } = useTranslation();

    return (
        <div className="flex h-full flex-1 items-center justify-center">
            <div className="inline-flex items-center gap-x-4 px-4 py-2 text-2xl font-bold leading-6 text-primary-200">
                <SpinnerBrainIcon />
                {`${t("common.loading")}...`}
            </div>
        </div>
    );
};

export default CardsLoading;
