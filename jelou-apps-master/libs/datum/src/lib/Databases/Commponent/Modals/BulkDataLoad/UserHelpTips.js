/**
 * Displays tips that will help make importing the file easier.
 * It's located on the right side of the bulk data upload modal.
 */

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import DataIcon from "../../../Illustrations/DataIcon";
import CheckIcon from "../../../Illustrations/CheckIcon";
import CalendarIcon from "../../../Illustrations/CalendarIcon";

export function UserHelpTips() {
    const { t } = useTranslation();
    return (
        <>
            <h4 className="ext-base text-primary-200">{t("datum.uploadModal.beforeUpload")}</h4>
            <div className="mt-5 grid grid-cols-[3rem_1fr] gap-y-5 text-sm">
                <div className="mr-1 flex justify-center">
                    <DataIcon />
                </div>
                <div>
                    <h5 className="font-bold">{t("datum.uploadModal.tip1Title")}</h5>
                    <p className="mb-2 text-justify text-[#727C94]">{t("datum.uploadModal.tip1A")}</p>
                    {/* Descomentar cuando esté disponible el endpoint */}
{/*                 <Link to={"#"} className="font-bold text-[#009FB0]">
                        {t("datum.uploadModal.tip1B")}
                    </Link> */}
                </div>
                <div className="mr-1 flex justify-center">
                    <CheckIcon />
                </div>
                <div>
                    <h5 className="font-bold">{t("datum.uploadModal.tip2Title")}</h5>
                    <div className="text-justify text-[#727C94]">
                        <p>{t("datum.uploadModal.tip2A")}</p>
                        <p>{t("datum.uploadModal.tip2B")}</p>
                    </div>
                </div>
                <div className="mr-1 flex justify-center">
                    <CalendarIcon />
                </div>
                <div>
                    <h5 className="font-bold">{t("datum.uploadModal.tip3Title")}</h5>
                    <p className="text-justify text-[#727C94]">{t("datum.uploadModal.tip3A")}</p>
                </div>
            </div>
        </>
    );
}
