import { CloseIcon, RefreshIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const NotificationUpdate = ({ setOff }) => {
    const { t } = useTranslation();
    return (
        <div className="flex w-full flex-col">
            <div className="flex h-[5vh] w-full items-center justify-between bg-gray-10 px-6 py-2">
                <div className="flex h-full items-center">
                    <RefreshIcon width="1.25rem" height="1.25rem" fill="#00B3C7" />
                    <span className="pl-2 font-primary font-semibold text-primary-200">{t("Notification.NewUpdate")}</span>
                </div>
                <span onClick={setOff}>
                    <CloseIcon className="cursor-pointer fill-current text-primary-200 " width="1rem" height="1rem" />
                </span>
            </div>
            <div className="flex w-full flex-row  bg-white px-6 py-4">
                <div className="w-full">
                    <img src="assets/illustrations/notificacionUpdate.svg" className="h-[7.1rem] 2xl:h-[10rem]" alt={""} loading="lazy" />
                </div>
                <div className="flex flex-col justify-between py-1 text-sm leading-5 2xl:py-6">
                    <span className="ml-2 text-gray-500 text-opacity-75">
                        {t("Notification.ThereIsA")}
                        <span className="font-bold text-gray-400">{t("Notification.newUpdate")}</span>, {t("Notification.RefreshPage")}
                    </span>
                    <button
                        className="borded w-[80%] self-center rounded-xl bg-primary-200 px-3 py-2 text-xs text-white"
                        onClick={() => {
                            window.location.reload();
                        }}>
                        {t("Notification.Refresh")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationUpdate;
