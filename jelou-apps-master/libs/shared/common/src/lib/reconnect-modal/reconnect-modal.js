import { ReconnectIcon } from "@apps/shared/icons";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ReconnectModal = (props) => {
    const { t } = useTranslation();
    const salesModal = useRef();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const company = useSelector((state) => state.company);
    const customLogin = get(company, "properties.redirectOnLogout", "");

    const login = () => {
        const campaignId = localStorage.getItem("campaignId") || 0;
        const campaignNotSeen = localStorage.getItem("campaignNotSeen") || false;

        localStorage.clear();

        localStorage.setItem("lang", lang);
        localStorage.setItem("campaignId", campaignId);
        localStorage.setItem("campaignNotSeen", campaignNotSeen);

        if (!isEmpty(customLogin)) {
            window.location = customLogin;
        }
        if (isEmpty(customLogin)) {
            window.location = "/login";
        }
    };

    return (
        <div className="absolute inset-x-0 top-0 z-120 sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div
                ref={salesModal}
                className="relative z-[125] flex w-[40rem] flex-col items-center overflow-hidden rounded-3xl border-3 border-white bg-white py-10 pr-6 text-center text-lg font-medium text-gray-400 hover:shadow-data-card">
                <div className="flex items-center space-x-8">
                    <ReconnectIcon width="301" height="241" />
                    <div className="flex flex-col">
                        <p className="text-left text-[1.875rem] font-bold text-primary-200">{t(`home.Ups`)}</p>
                        <p className="text-left font-bold text-primary-200">{t("home.tu sesión ha expirado")}</p>
                        <div className="w-[12.3125rem]">
                            <p className="mt-2 text-left text-15 font-light leading-[1.375rem] text-gray-400">
                                {t("home.Tu sesión expiró. No te preocupes, inicia sesión nuevamente")}
                            </p>
                            <div className="flex justify-end">
                                <button
                                    className="color-gradient mt-4 w-max rounded-20 px-4 py-2 text-sm font-bold text-white"
                                    onClick={() => login()}>
                                    {t("home.Iniciar sesión")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReconnectModal;
