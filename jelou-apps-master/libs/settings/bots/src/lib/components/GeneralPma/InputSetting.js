import { PremiunConfigIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const InputSetting = (props) => {
    const { settingInfo, handleChangeSetting, valueIsSet, getValue, handleOnClickPremium } = props;
    const { displayName, description, key, premiumFeature } = settingInfo;
    const { t } = useTranslation();
    const inputCheckboxClassName =
        "mt-1 mr-2 h-4 w-4 rounded-default border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200";

    return !premiumFeature ? (
        <div className="flex px-8 py-3">
            <input
                id={key}
                checked={valueIsSet(key) && getValue("checkbox", key)}
                onChange={(evt) => handleChangeSetting(evt, "boolean", null)}
                name={key}
                type="checkbox"
                className={inputCheckboxClassName}
            />
            <label className="ml-3 flex w-80 flex-col hover:cursor-pointer" htmlFor={key}>
                <p className="text-15 font-bold text-gray-400 text-opacity-80">{displayName}</p>
                <p className="text-sm text-gray-400 text-opacity-80">{description}</p>
            </label>
        </div>
    ) : (
        <div className="flex px-8 py-3 hover:cursor-pointer" onClick={() => handleOnClickPremium(displayName)}>
            <PremiunConfigIcon width="1.3rem" height="1.3rem" className="text-[#EEBE39]" />
            <div className="ml-3 flex w-80 flex-col">
                <div className="flex">
                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{displayName}</p>
                    <span className="ml-2 flex items-center rounded-20 bg-[#FFFBF1] px-1 text-10 font-bold text-[#EEBE39]">{t("settings.bots.paidLicense")}</span>
                </div>
                <p className="text-sm text-gray-400 text-opacity-80">{description}</p>
            </div>
        </div>
    );
};

export default InputSetting;
