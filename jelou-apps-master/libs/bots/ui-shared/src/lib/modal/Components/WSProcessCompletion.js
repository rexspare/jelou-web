import { CloseIcon, JelouLogoIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

export function WSProcessCompletion({ setShowFinishLogin }) {
    const onClose = () => setShowFinishLogin(false);
    const { t } = useTranslation();

    return (
        <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className="w-[37rem] transform rounded-lg bg-white px-6 pt-5 pb-4 shadow-modal transition-all">
                <div className="mb-3 flex items-center justify-between pb-4">
                    <div className="flex items-center">
                        <div className={`bg-primary mr-2 flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 md:mr-4`}>
                            <JelouLogoIcon width="1.875rem" height="2.4rem" />
                        </div>
                        <div className="max-w-md text-base font-bold text-gray-400 md:text-2xl">{t("botsChooseChannel.titleFinishModal")}</div>
                    </div>
                    <span onClick={onClose}>
                        <CloseIcon className="cursor-pointer fill-current text-gray-450" width="1rem" height="1rem" />
                    </span>
                </div>
                <div className="px-10 pb-10 text-gray-400 text-opacity-75">
                    <p>{t("botsChooseChannel.bodyFinishModal")}</p>
                </div>
                <div className="flex w-full justify-end">
                    <button onClick={onClose} className="button-primary w-32">
                        {t("hsm.close")}
                    </button>
                </div>
            </div>
        </div>
    );
}
