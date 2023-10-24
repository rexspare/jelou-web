import { t } from "i18next";
import { LoadingSpinner } from "@apps/shared/icons";

const TriggerFooterButtons = ({ cancelTrigger, submitTrigger, loading, disableSaveButton, labelBtnSecondary = t("shop.modal.cancel"), labelBtnPrincipal }) => {
    return (
        <footer className="flex gap-4 mt-4">
            <button
                type="button"
                onClick={cancelTrigger}
                className="px-5 py-3 text-base font-bold text-gray-400 border-transparent outline-none rounded-3xl bg-gray-10"
            >
                {labelBtnSecondary}
            </button>
            <button 
                type="submit" 
                disabled={loading || disableSaveButton} 
                onClick={submitTrigger}
                className="flex cursor-pointer items-center space-x-2 whitespace-nowrap rounded-3xl border-transparent bg-[#00B3C7] py-3 px-5 text-base text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
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

export default TriggerFooterButtons;