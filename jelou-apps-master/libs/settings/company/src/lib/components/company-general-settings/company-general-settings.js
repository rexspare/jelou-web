import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SelectSearch, { fuzzySearch } from "react-select-search";
import GeneralPmaSkeleton from "./generalPmaSkeleton";

import { AssignationIcon, CheckCircleIcon } from "@apps/shared/icons";
import { mergeById } from "@apps/shared/utils";
import { BeatLoader } from "react-spinners";
import DropDownMenu from "../DropDownMenu";

function CompanyGeneralSettings(props) {
    const {
        loadingSettings,
        setOpenRestoreConfigModal,
        setKeysToRestore,
        settingsBody,
        configSettingsBody,
        allBotConfig,
        settingsBodyRef,
        bots,
        setActualBot,
        handleSubmitConfig,
        loadingUpdateEntity,
        noBodyData,
    } = props;
    const { t } = useTranslation();

    const balanceOptions = [
        { name: t("settings.companySettings.actual"), value: "currentLoadRooms" },
        { name: t("settings.companySettings.diary"), value: "totalConversationsDay" },
    ];

    const generalCompanyKeysToRestore = ["hasQueue", "hasBroadCast", "operatorView.tickets.enable", "operatorView.assignationBalancer.balancer", "queueThreshold"];

    const generalCompanyKeys = [{ key: "hasQueue" }, { key: "operatorView.assignationBalancer.balancer" }, { key: "queueThreshold" }, { key: "hasBroadcast" }];

    const inputCheckboxClassName =
        "mt-1 mr-2 h-4 w-4 rounded-default border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200";

    const getConfigValues = () => {
        const filteredConfigBySection = allBotConfig.filter((configObj) => generalCompanyKeys.find((obj) => obj.key === configObj.key));
        configSettingsBody("settings", filteredConfigBySection);
        settingsBodyRef.current = filteredConfigBySection;
    };

    useEffect(() => {
        setKeysToRestore(generalCompanyKeysToRestore);
    }, []);

    useEffect(() => {
        setActualBot(first(bots));
        configSettingsBody();
    }, [bots]);

    useEffect(() => {
        getConfigValues();
    }, [allBotConfig]);

    const handleChangeSetting = (event, typeOf) => {
        let temporalSettings = settingsBody.settings;
        if (event.target.id === "hasQueue") {
            const settingsObj = {
                key: "operatorView.tickets.enable",
                typeOf,
                value: event.target.checked,
                unity: null,
                module: "PMA",
            };
            temporalSettings = mergeById(temporalSettings, settingsObj, "key");
        }

        const settingsObj = {
            key: event.target.id,
            typeOf,
            value: typeOf === "boolean" ? event.target.checked : event.target.value === "" ? "" : Number(event.target.value),
            unity: null,
            module: "PMA",
        };
        temporalSettings = mergeById(temporalSettings, settingsObj, "key");
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
                if (settingBody["value"] === null) {
                    return "";
                } else {
                    return settingBody["value"];
                }
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
        return !isEmpty(selectedValuesFiltered);
    };

    const handleSelectValue = (key, value) => {
        const settingsObj = {
            key,
            typeOf: "string",
            value,
            unity: null,
            module: "PMA",
        };
        const temporalSettings = mergeById(settingsBody.settings, settingsObj, "key");
        configSettingsBody("settings", temporalSettings);
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
            <div className="h-[85%] w-full overflow-auto px-8 pt-6 pb-6">
                {loadingSettings ? (
                    <GeneralPmaSkeleton />
                ) : (
                    <>
                        <div className="flex border-b-0.5 border-gray-5 pb-6">
                            <input
                                checked={valueIsSet("hasBroadcast") && getValue("checkbox", "hasBroadcast")}
                                onChange={(evt) => handleChangeSetting(evt, "boolean", "PMA")}
                                type="checkbox"
                                id="hasBroadcast"
                                name="hasBroadcast"
                                className={inputCheckboxClassName}
                            />
                            <label className="ml-3 flex w-80 flex-col hover:cursor-pointer" htmlFor="hasBroadcast">
                                <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.companySettings.letHsm")}</p>
                                <p className="text-sm text-gray-400 text-opacity-80">{t("settings.companySettings.letHsmDescr")}</p>
                            </label>
                        </div>
                        <div className="flex items-center pt-6">
                            <AssignationIcon width="1.4rem" height="1.4rem" />
                            <p className="ml-5 text-base font-bold text-gray-400 text-opacity-80">{t("botsSettingsCategoriesDeskhelpSettings.rules")}</p>
                        </div>
                        <div className="flex py-5">
                            <input
                                checked={valueIsSet("hasQueue") && getValue("checkbox", "hasQueue")}
                                onChange={(evt) => handleChangeSetting(evt, "boolean", "PMA")}
                                id="hasQueue"
                                type="checkbox"
                                className={inputCheckboxClassName}
                            />
                            <div className="ml-3 flex">
                                <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.companySettings.activQueues")}</p>
                            </div>
                        </div>
                        <div className="ml-[2.15rem] flex w-80 flex-col">
                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.companySettings.configCases")}</p>
                            <p className="text-sm text-gray-400 text-opacity-80">{t("settings.companySettings.configCasesDescr")}</p>
                            <div className="relative">
                                <SelectSearch
                                    id="operatorView.assignationBalancer.balancer"
                                    options={balanceOptions}
                                    className="moduleSelect timeSelect mt-3 text-sm"
                                    filterOptions={fuzzySearch}
                                    value={valueIsSet("operatorView.assignationBalancer.balancer") ? getValue("string", "operatorView.assignationBalancer.balancer") : ""}
                                    onChange={(value) => handleSelectValue("operatorView.assignationBalancer.balancer", value)}
                                    search
                                    placeholder={t("schedule.select")}
                                />
                            </div>
                        </div>
                        <div className="ml-[2.15rem] flex w-80 flex-col pt-5 pb-8">
                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("Umbral de colas del bot")}</p>
                            <p className="text-sm text-gray-400 text-opacity-80">{t("settings.companySettings.maxUsersQueues")}</p>
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
                <div className="mr-6 flex justify-end border-t-0.5 border-gray-5 pt-6 pb-4">
                    <div className="mt-6 flex text-center md:mt-0">
                        <button type="submit" className="button-primary w-32" disabled={loadingUpdateEntity || noBodyData} onClick={handleSubmitConfig}>
                            {loadingUpdateEntity ? <BeatLoader color={"white"} size={"0.625rem"} /> : t("hsm.save")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default CompanyGeneralSettings;
