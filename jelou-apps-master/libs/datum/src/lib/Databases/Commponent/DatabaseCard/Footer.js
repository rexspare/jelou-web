import { useTranslation } from "react-i18next";

import { LeftArrow } from "@apps/shared/icons";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <div className="flex w-full flex-col">
            <div className="relative flex w-full items-center justify-end space-x-2 border-t-0.5 border-gray-400 border-opacity-15 pt-2">
                <div className="absolute bottom-[30px] right-0 z-[-1] hidden group-hover:flex ">
                    <svg width="61" height="126" viewBox="0 0 61 126" fill="none">
                        <rect x="34" width="27" height="126" fill="#E6F7F9" />
                        <rect y="24" width="28" height="102" fill="#E6F7F9" />
                    </svg>
                </div>
                <span className="text-opacity-59 text-sm font-bold text-gray-400 group-hover:text-primary-200">
                    {t("dataReport.enterDB")}
                </span>
                <LeftArrow className="mt-1" width="10" height="8" />
            </div>
        </div>
    );
};

export default Footer;