import toUpper from "lodash/toUpper";

import { ENDED_REASON, USER_STATE } from "@apps/shared/constants";
import { useTranslation } from "react-i18next";

export default function useLabels() {
    const { t } = useTranslation();

    const renderStatus = (status) => {
        const badgeStyle = "min-w-24 justify-center inline-flex items-center px-3 rounded-full text-xs font-medium leading-4 bg-";
        switch (toUpper(status)) {
            case USER_STATE.ACTIVE:
                return <span className={`${badgeStyle} bg-teal-200 uppercase text-teal-800`}>{t("Activa")}</span>;
            case USER_STATE.EXPIRED:
                return <span className={`${badgeStyle} bg-red-200 uppercase text-red-800`}>{t("Expirada")}</span>;
            case USER_STATE.CLOSED:
                return <span className={`${badgeStyle} bg-gray-200 uppercase text-gray-375`}>{t("Cerrada")}</span>;
            case USER_STATE.TRANSFERRED:
                return <span className={`${badgeStyle} bg-orange-200 uppercase text-orange-800`}>{t("Transferida")}</span>;
            case USER_STATE.AUTO_TRANSFER:
                return <span className={`${badgeStyle} bg-orange-200 uppercase text-orange-800`}>{t("Auto transferida")}</span>;
            default:
                return <span className={`${badgeStyle} bg-black-200 text-black-800`}>{t("UNDEFINED")}</span>;
        }
    };

    const renderEndedReason = (endedReason) => {
        const badgeStyle = "min-w-24 justify-center inline-flex items-center px-3 rounded-full text-xs font-medium leading-4 bg-";
        switch (toUpper(endedReason)) {
            case ENDED_REASON.EXPIRED:
                return <span className={`${badgeStyle} h-8 bg-red-200 uppercase text-red-800`}>{t("Expiración")}</span>;
            case ENDED_REASON.CLOSED_BY_AUTO_TRANSFER:
                return <span className={`${badgeStyle} h-8 bg-gray-200 uppercase text-gray-375`}>{t("Cierre automático")}</span>;
            case ENDED_REASON.CLOSED_BY_OPERATOR:
                return <span className={`${badgeStyle} h-8 bg-gray-200 uppercase text-gray-375`}>{t("Cierre del operador")}</span>;
            case ENDED_REASON.TRANSFERRED:
                return <span className={`${badgeStyle} h-8 bg-orange-200 uppercase text-orange-800`}>{t("Transferencia")}</span>;
            default:
                return <span className={`${badgeStyle} bg-black-200 text-black-800 h-8`}>{t("UNDEFINED")}</span>;
        }
    };

    const renderRepliedBadge = (wasReplied) => {
        const badgeStyle = "min-w-24 justify-center inline-flex items-center px-3 py-1 rounded-full text-xs font-medium leading-4 bg-";
        if (wasReplied) {
            return <span className={`${badgeStyle} bg-teal-200 uppercase text-teal-800`}>{t("Gestionado")}</span>;
        } else {
            return <span className={`${badgeStyle} bg-red-200 uppercase text-red-800`}>{t("No Gestionado")}</span>;
        }
    };

    const renderOriginBadge = (origin) => {
        const badgeStyle = "min-w-24 justify-center inline-flex items-center px-3 rounded-full text-xs font-medium leading-4 uppercase";
        switch (toUpper(origin)) {
            case "INDUCED":
                return (
                    <span className={`${badgeStyle} inline-flex items-center rounded-full py-0.5 text-xs font-medium leading-4 text-blue-400`}>
                        {t("Inducido")}
                    </span>
                );
            case "INDUCED_BY_SYSTEM":
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-blue-200 py-0.5 text-xs font-medium leading-4 text-blue-400`}>
                        {t("Inducido sistema")}
                    </span>
                );
            case "INDUCED_BY_ADMIN":
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-blue-200 py-0.5 text-xs font-medium leading-4 text-blue-400`}>
                        {t("Inducido admin")}
                    </span>
                );
            case "INDUCED_BY_OPERATOR":
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-blue-200 py-0.5 text-xs font-medium leading-4 text-blue-400`}>
                        {t("Inducido operador")}
                    </span>
                );
            case "CLOSED":
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-gray-300 py-0.5 text-xs font-medium leading-4 text-gray-400`}>
                        {t("Cerrado")}
                    </span>
                );
            case "TRANSFER":
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-orange-200 py-0.5 text-xs font-medium leading-4 text-orange-800`}>
                        {t("Transferido")}
                    </span>
                );
            case "AUTO_TRANSFER":
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-orange-200 py-0.5 text-xs font-medium leading-4 text-orange-800`}>
                        {t("Transferido Automáticamente")}
                    </span>
                );
            case "TICKET":
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-green-400 py-0.5 text-xs font-medium leading-4 text-green-900`}>
                        {t("Ticket")}
                    </span>
                );
            case "BROADCAST":
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-green-200 py-0.5 text-xs font-medium leading-4 text-green-400`}>
                        {t("Difusión")}
                    </span>
                );
            case "ORGANIC":
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-orange-200 py-0.5 text-xs font-medium leading-4 text-orange-400`}>
                        {t("Orgánico")}
                    </span>
                );
            default:
                return (
                    <span
                        className={`${badgeStyle} inline-flex items-center rounded-full bg-orange-200 py-0.5 text-xs font-medium leading-4 text-orange-400`}>
                        {t("Orgánico")}
                    </span>
                );
        }
    };
    return { renderEndedReason, renderRepliedBadge, renderOriginBadge, renderStatus };
}
