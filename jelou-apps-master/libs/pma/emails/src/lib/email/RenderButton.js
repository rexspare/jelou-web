import toUpper from "lodash/toUpper";
import { useTranslation } from "react-i18next";

export const RenderButton = ({ status }) => {
    const { t } = useTranslation();
    const badgeStyle = "flex justify-center items-center px-2 py-1 rounded-[7px] text-[10px] font-bold w-fit";

    switch (toUpper(status)) {
        case "NEW":
            return <span className={`${badgeStyle} block bg-[#FFE18566] uppercase text-[#D39C00]`}>{t(status)}</span>;
        case "OPEN":
            return <span className={`${badgeStyle} block bg-[#00B3C71A] uppercase text-[#00B3C7]`}>{t(status)}</span>;
        case "PENDING":
            return <span className={`${badgeStyle} block bg-[#E47B6A40] uppercase text-[#B95C49]`}>{t(status)}</span>;
        case "RESOLVED":
            return <span className={`${badgeStyle} block bg-[#209F8B26] uppercase text-[#209F8B]`}>{t(status)}</span>;
        case "CLOSED":
            return <span className={`${badgeStyle} block bg-[#a6b4d0] bg-opacity-25 uppercase text-[#727C94A6]`}>{t(status)}</span>;
        default:
            return <span className={`${badgeStyle} block bg-[#FFE18566] uppercase text-[#D39C00]`}>{t(status)}</span>;
    }
};
