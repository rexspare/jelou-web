import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GeneralPmaSkeleton from "./generalPmaSkeleton";

import { AssignationIcon, CheckCircleIcon } from "@apps/shared/icons";
import { mergeById } from "@apps/shared/utils";
import { BeatLoader } from "react-spinners";
import DropDownMenu from "../DropDownMenu";

function TeamsGeneralSettings(props) {
    const { loadingSettings, setOpenRestoreConfigModal, setKeysToRestore, settingsBody, configSettingsBody, allBotConfig, settingsBodyRef, handleSubmitConfig, loadingUpdateEntity, noBodyData } =
        props;
    const { t } = useTranslation();

    const generalCompanyKeysToRestore = ["operatorView.tickets.enable", "operatorView.assignationBalancer.balancer", "queueThreshold"];

    const generalCompanyKeys = [{ key: "queueThreshold" }];

    const getConfigValues = () => {
        const filteredConfigBySection = allBotConfig.filter((configObj) => generalCompanyKeys.find((obj) => obj.key === configObj.key));
        configSettingsBody("settings", filteredConfigBySection);
        settingsBodyRef.current = filteredConfigBySection;
    };

    useEffect(() => {
        setKeysToRestore(generalCompanyKeysToRestore);
    }, []);

    useEffect(() => {
        getConfigValues();
    }, [allBotConfig]);

    const handleChangeSetting = (event, typeOf) => {
        const settingsObj = {
            key: event.target.id,
            typeOf,
            value: typeOf === "boolean" ? event.target.checked : event.target.value === "" ? "" : Number(event.target.value),
            unity: null,
            module: "PMA",
        };
        const temporalSettings = mergeById(settingsBody.settings, settingsObj, "key");
        configSettingsBody("settings", temporalSettings);
    };

    const getValue = (type, key) => {
        const filteredSetting = settingsBody.settings.filter((setting) => setting.key === key);
        const settingBody = first(filteredSetting);
        if (type === "unity") {
            if (!isEmpty(settingBody)) {
                return settingBody["unity"];
            }
            return;
        }

        if (type === "number" || type === "string") {
            if (!isEmpty(settingBody)) {
                return settingBody["value"];
            }
            return;
        }

        if (type === "checkbox") {
            if (!isEmpty(settingBody)) {
                return Boolean(settingBody["value"]);
            }
            return;
        }
    };

    const valueIsSet = (key) => {
        const selectedValuesFiltered = settingsBody.settings.filter((selectedValue) => selectedValue.key === key);
        if (!isEmpty(selectedValuesFiltered)) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <>
            <div className="flex w-full items-center justify-between border-b-0.5 border-gray-5 py-8 pl-10 pr-6">
                <div className="flex items-center">
                    <CheckCircleIcon className={"mr-4 text-primary-200"} width="1.4rem" height="1.2rem" />
                    <p className={`text-base font-bold text-primary-200`}>{t("settings.mapGen.configMap")}</p>
                </div>
                <DropDownMenu //  setOpenDuplicateModal={setOpenDuplicateModal}
                    setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                />
            </div>
            <div className="border-b-0.5 border-gray-5 px-8 pt-6 pb-6">
                {loadingSettings ? (
                    <GeneralPmaSkeleton />
                ) : (
                    <>
                        <div className="flex items-center ">
                            <AssignationIcon width="1.4rem" height="1.4rem" />
                            <p className="ml-5 text-base font-bold text-gray-400 text-opacity-80">{t("botsSettingsCategoriesDeskhelpSettings.rules")}</p>
                        </div>

                        <div className="ml-[2.15rem] flex w-80 flex-col py-5">
                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.teams.threshold")}</p>
                            <p className="text-sm text-gray-400 text-opacity-80">{t("settings.teams.thresholdDescr")}</p>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="queueThreshold"
                                    onChange={(evt) => handleChangeSetting(evt, "number", null)}
                                    value={valueIsSet("queueThreshold") ? getValue("number", "queueThreshold") : ""}
                                    placeholder={t("00")}
                                    className={`mt-3 w-full rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="my-6 mr-6 flex justify-end">
                <div className="mt-6 flex text-center md:mt-0">
                    <button type="submit" className="button-primary w-32" disabled={loadingUpdateEntity || noBodyData} onClick={handleSubmitConfig}>
                        {loadingUpdateEntity ? <BeatLoader color={"white"} size={"0.625rem"} /> : t("hsm.save")}
                    </button>
                </div>
            </div>
        </>
    );
}
export default TeamsGeneralSettings;
