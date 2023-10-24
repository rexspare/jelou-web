import React from "react";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import "../../i18n";

const CardRole = (props) => {
    const { role, active } = props;
    const byDefault = role.default;
    const { t } = useTranslation();

    return (
        <div
            className={`inline-flex w-full cursor-pointer items-center py-3 px-5 align-middle ${
                active ? "border-r-5 border-primary-200 bg-primary-2" : ""
            }`}>
            <span className="relative mr-3">
                <Avatar
                    color="#D7EAFF"
                    name={role.name}
                    size={"2.813rem"}
                    fgColor="#7E819F"
                    round={true}
                    textSizeRatio={2.5}
                    className="font-medium"
                />
            </span>
            <div className="flex w-full pl-1">
                <dd className="w-full text-15 font-bold text-gray-400">{role.name}</dd>
                {byDefault === 1 && (
                    <span className="inline-flex w-xxs items-center rounded-full bg-primary-300 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {t("rolesCard.default")}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CardRole;
