import { WarningIcon2 } from "@apps/shared/icons";
import React from "react";
import { useTranslation } from "react-i18next";

const BubbleNotSupported = () => {
    const { t } = useTranslation();
    return (
        <div className="my-2 flex w-full items-center justify-center">
            <div className="mx-auto flex w-full items-center justify-center space-x-3">
                <div className="ml-3 h-0.25 flex-1 bg-gray-850/10"></div>
                <div className="flex min-h-7 items-center justify-end space-x-2 rounded-lg border-default border-gray-100 border-opacity-25 bg-white px-4 py-1 text-center text-xs text-gray-450">
                    <WarningIcon2 width={"0.925rem"} />
                    <p className="flex flex-1 justify-center text-center">{t("pma.Burbuja no soportada")}</p>
                </div>
                <div className="ml-3 h-0.25 flex-1 bg-gray-850/10"></div>
            </div>
        </div>
    );
};

export default BubbleNotSupported;
