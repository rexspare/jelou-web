import { useTranslation } from "react-i18next";

export default function PERIODS() {
    const { t } = useTranslation();
    const PERIODS = [
        {
            label: t("plugins.Hoy"),
            value: "today",
            display: true,
        },
        {
            label: t("clients.thisWeek"),
            value: "currentWeek",
            display: true,
        },
        {
            label: t("clients.thisMonth"),
            value: "currentMonth",
            display: true,
        },
        {
            label: t("dataReport.thisYear"),
            value: "currentYear",
            display: true,
        },
    ];

    return PERIODS;
}
