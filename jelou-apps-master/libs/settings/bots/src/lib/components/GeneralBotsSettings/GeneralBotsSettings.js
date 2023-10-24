import { CheckCircleIcon, PremiunConfigIcon } from "@apps/shared/icons";
import { mergeById } from "@apps/shared/utils";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SelectSearch, { fuzzySearch } from "react-select-search";
import { BeatLoader } from "react-spinners";
import DropDownMenu from "../DropDownMenu";
import GeneralBotsSkeleton from "./GeneralBotsSkeleton";

const GeneralBotsSettings = (props) => {
    const {
        handleOnClickPremium,
        setKeysToRestore,
        settingsBodyRef,
        setSettingsValidation,
        validateConfigComplete,
        setOpenRestoreConfigModal,
        loadingSettings,
        noBodyData,
        loadingUpdateEntity,
        allBotConfig,
        setOpenDuplicateModal,
        timeUnitsOptions,
        handleSubmitConfig,
        configSettingsBody,
        settingsBody,
    } = props;

    const { t } = useTranslation();

    const generalBotsKeysToRestore = [
        "mergeBubbles",
        "audioEnabled",
        "cacheLimits.option",
        "hsmReplyTtl",
        "cacheLimits.input",
        "cacheRepliesTtl.quick_replies",
        "maxAttempts",
        "sessionLimitByMonth",
        "operator",
    ];

    const generalBotsKeys = [
        { key: "mergeBubbles" },
        { key: "audioEnabled" },
        { key: "cacheLimits.option" },
        { key: "hsmReplyTtl" },
        { key: "cacheLimits.input" },
        { key: "cacheRepliesTtl.quick_replies" },
        { key: "maxAttempts" },
        { key: "sessionLimitByMonth" },
        { key: "operator" },
    ];

    const getConfigValues = () => {
        const filteredConfigBySection = allBotConfig.filter((configObj) => generalBotsKeys.find((obj) => obj.key === configObj.key));
        configSettingsBody("settings", filteredConfigBySection);
        const settingsWithUnity = filteredConfigBySection.filter((obj) => obj.unity !== null && obj.unity !== "");
        let arrayConfig = [];
        settingsWithUnity.forEach((element) => {
            const configObj = {
                key: element.key,
                types: ["number", "unity"],
            };
            arrayConfig.push(configObj);
        });

        setSettingsValidation(arrayConfig);
        settingsBodyRef.current = filteredConfigBySection;
    };

    useEffect(() => {
        setKeysToRestore(generalBotsKeysToRestore);
    }, []);

    useEffect(() => {
        getConfigValues();
    }, [allBotConfig]);

    const operatorKeyExists = settingsBody.settings.some((setting) => setting.key === "operator");

    const handleChangeSetting = (event, typeOf, module) => {
        // get value associated to key before to do the mergeById (To keep the reference)
        const settings = get(settingsBody, "settings", []);
        const arrayRef = settings.filter((settingObj) => settingObj.key === event.target.id);
        const refUnity = get(first(arrayRef), "unity", null);

        const settingsObj = {
            key: event.target.id,
            typeOf,
            value: typeOf === "boolean" ? event.target.checked : typeOf === "number" && event.target.value !== "" ? Number(event.target.value) : event.target.value,
            unity: refUnity === "" ? null : refUnity,
            module,
        };
        const temporalSettings = mergeById(settingsBody.settings, settingsObj, "key");
        configSettingsBody("settings", temporalSettings);
    };

    const handleSelectUnity = (key, unity) => {
        // get value associated to key before to do the mergeById (To keep the reference)
        const settings = get(settingsBody, "settings", []);
        const arrayRef = settings.filter((settingObj) => settingObj.key === key);
        const refValue = get(first(arrayRef), "value", {});

        const settingsObj = {
            key,
            typeOf: "string",
            value: refValue,
            unity,
            module: "VIRTUAL_ASSISTANT",
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

        if (type === "number") {
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
        return !isEmpty(selectedValuesFiltered);
    };

    // Don't allow decimal number on inputs
    const intRx = /\d/,
        integerChange = (event) => {
            if (event.key.length > 1 || event.ctrlKey || (event.key === "-" && !event.currentTarget.value.length) || intRx.test(event.key)) return;
            event.preventDefault();
        };

    for (let input of document.querySelectorAll('input[type="number"][step="1"]')) input.addEventListener("keydown", integerChange);
    //
    const inputCheckboxClassName =
        "mt-1 mr-2 h-4 w-4 rounded-default border-1 border-gray-300 text-primary-200 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200";

    return (
        <>
            <div className="flex w-full items-center justify-between border-b-0.5 border-gray-5 py-8 pl-10 pr-6">
                <div className="flex items-center">
                    <CheckCircleIcon className={"mr-4 text-primary-200"} width="1.4rem" height="1.2rem" />
                    <p className={`text-base font-bold text-primary-200`}>{t("settings.bots.configGeneral")}</p>
                </div>
                <DropDownMenu setOpenDuplicateModal={setOpenDuplicateModal} setOpenRestoreConfigModal={setOpenRestoreConfigModal} />
            </div>
            <div className="h-[85%] w-full overflow-auto px-8">
                {loadingSettings ? (
                    <GeneralBotsSkeleton />
                ) : (
                    <>
                        <div className="border-b-0.5 border-gray-5 py-6">
                            <div className="flex px-8 py-3">
                                <input
                                    checked={valueIsSet("mergeBubbles") && getValue("checkbox", "mergeBubbles")}
                                    id="mergeBubbles"
                                    onChange={(evt) => handleChangeSetting(evt, "boolean", "VIRTUAL_ASSISTANT")}
                                    name="mergeBubbles"
                                    type="checkbox"
                                    className={inputCheckboxClassName}
                                />
                                <label className="ml-3 flex w-80 flex-col hover:cursor-pointer" htmlFor="mergeBubbles">
                                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("botsSettingsCategoriesGeneral.mergeBubbles")}</p>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.bots.mergeBubbText")}</p>
                                </label>
                            </div>
                            <div className="flex px-8 py-3">
                                <input
                                    checked={(valueIsSet("operator") && getValue("checkbox", "operator")) || !operatorKeyExists}
                                    id="operator"
                                    onChange={(evt) => handleChangeSetting(evt, "boolean", "VIRTUAL_ASSISTANT")}
                                    name="operator"
                                    type="checkbox"
                                    className={inputCheckboxClassName}
                                />
                                <label className="ml-3 flex w-80 flex-col hover:cursor-pointer" htmlFor="operator">
                                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.Visualizar bot en monitoreo")}</p>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.Permite vizualizar interacciones de bots que tenga PMA en la sección de monitoreo")}</p>
                                </label>
                            </div>
                            {/* <div className="flex px-8 py-3">
                                <input
                                    checked={valueIsSet("audioEnabled") && getValue("checkbox", "audioEnabled")}
                                    id="audioEnabled"
                                    onChange={(evt) => handleChangeSetting(evt, "boolean", "VIRTUAL_ASSISTANT")}
                                    name="bubbleFussion"
                                    type="checkbox"
                                    className={inputCheckboxClassName}
                                />
                                <div className=" ml-3 flex w-80 flex-col">
                                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("Reconocimiento de audio")}</p>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("Permite que el bot entienda notas de voz.")}</p>
                                </div>
                            </div> */}
                            <div className="flex px-8 py-3 hover:cursor-pointer" onClick={() => handleOnClickPremium(t("settings.bots.audioRecognition"))}>
                                <PremiunConfigIcon width="1.3rem" height="1.3rem" className="text-[#EEBE39]" />
                                <div className=" ml-3 flex w-80 flex-col">
                                    <div className="flex">
                                        <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.bots.audioRecognition")}</p>{" "}
                                        <span className="ml-2 flex items-center rounded-20 bg-[#FFFBF1] px-1 text-10 font-bold text-[#EEBE39]">{t("settings.bots.paidLicense")}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.bots.audioRecognitionText")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-b-0.5 border-gray-5 py-6">
                            <div className="flex flex-col px-8 py-3">
                                <div className="flex w-80 flex-col">
                                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.bots.timeAnswere")}</p>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.bots.timeAnswereText")}</p>
                                </div>
                                <div className="flex">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={0}
                                            step={"1"}
                                            pattern="^[-/d]/d*$"
                                            id="cacheLimits.option"
                                            onChange={(evt) => {
                                                handleChangeSetting(evt, "number", "VIRTUAL_ASSISTANT");
                                                validateConfigComplete(evt.target.value, evt.target.id, "number");
                                            }}
                                            value={valueIsSet("cacheLimits.option") ? getValue("number", "cacheLimits.option") : ""}
                                            placeholder={t("00")}
                                            className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                        />
                                    </div>
                                    <div className="relative flex items-center">
                                        <SelectSearch
                                            id="cacheLimits_option_unity"
                                            options={timeUnitsOptions}
                                            className="moduleSelect timeSelect z-0 mt-3 w-32 text-sm"
                                            filterOptions={fuzzySearch}
                                            value={valueIsSet("cacheLimits.option") ? getValue("unity", "cacheLimits.option") : ""}
                                            search
                                            placeholder={t("schedule.select")}
                                            onChange={(value) => {
                                                handleSelectUnity("cacheLimits.option", value);
                                                validateConfigComplete(value, "cacheLimits.option", "unity");
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col px-8 py-3">
                                <div className="flex w-80 flex-col">
                                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.bots.timeAnswereHsm")}</p>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.bots.timeAnswereTextHsm")}</p>
                                </div>
                                <div className="flex">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="hsmReplyTtl"
                                            onChange={(evt) => {
                                                handleChangeSetting(evt, "number", "VIRTUAL_ASSISTANT");
                                                validateConfigComplete(evt.target.value, evt.target.id, "number");
                                            }}
                                            value={valueIsSet("hsmReplyTtl") ? getValue("number", "hsmReplyTtl") : ""}
                                            placeholder={t("00")}
                                            className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                        />
                                    </div>
                                    <div className="relative">
                                        <SelectSearch
                                            // disabled={disableHours || disableClick}
                                            id="hsmReplyTtl_unity"
                                            options={timeUnitsOptions}
                                            className="moduleSelect timeSelect mt-3 w-32 text-sm"
                                            filterOptions={fuzzySearch}
                                            value={valueIsSet("hsmReplyTtl") ? getValue("unity", "hsmReplyTtl") : ""}
                                            search
                                            placeholder={t("schedule.select")}
                                            onChange={(value) => {
                                                handleSelectUnity("hsmReplyTtl", value);
                                                validateConfigComplete(value, "hsmReplyTtl", "unity");
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col px-8 py-3">
                                <div className="flex w-80 flex-col">
                                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.bots.timeAnswereHsmAsk")}</p>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.bots.timeAnswereTexAsk")}</p>
                                </div>
                                <div className="flex">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="cacheLimits.input"
                                            onChange={(evt) => {
                                                validateConfigComplete(evt.target.value, "cacheLimits.input", "number");
                                                handleChangeSetting(evt, "number", "VIRTUAL_ASSISTANT");
                                            }}
                                            value={valueIsSet("cacheLimits.input") ? getValue("number", "cacheLimits.input") : ""}
                                            placeholder={t("00")}
                                            className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                        />
                                    </div>
                                    <div className="relative">
                                        <SelectSearch
                                            id="cacheLimits_input_unity"
                                            // disabled={disableHours || disableClick}
                                            options={timeUnitsOptions}
                                            className="moduleSelect timeSelect mt-3 w-32 text-sm"
                                            filterOptions={fuzzySearch}
                                            value={valueIsSet("cacheLimits.input") ? getValue("unity", "cacheLimits.input") : ""}
                                            search
                                            placeholder={t("schedule.select")}
                                            onChange={(value) => {
                                                validateConfigComplete(value, "cacheLimits.input", "unity");
                                                handleSelectUnity("cacheLimits.input", value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col px-8 py-3">
                                <div className="flex w-80 flex-col">
                                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.bots.timeExpWhats")}</p>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.bots.timeExpWhatsText")}</p>
                                </div>
                                <div className="flex">
                                    <div className="relative">
                                        <input
                                            id="cacheRepliesTtl.quick_replies"
                                            type="number"
                                            onChange={(evt) => {
                                                validateConfigComplete(evt.target.value, "cacheRepliesTtl.quick_replies", "number");

                                                handleChangeSetting(evt, "number", "VIRTUAL_ASSISTANT");
                                            }}
                                            value={valueIsSet("cacheRepliesTtl.quick_replies") ? getValue("number", "cacheRepliesTtl.quick_replies") : ""}
                                            placeholder={t("00")}
                                            className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                        />
                                    </div>
                                    <div className="relative">
                                        <SelectSearch
                                            id="cacheRepliesTtl_quick_replies_unity"
                                            // disabled={disableHours || disableClick}
                                            options={timeUnitsOptions}
                                            className="moduleSelect timeSelect mt-3 w-32 text-sm"
                                            filterOptions={fuzzySearch}
                                            value={valueIsSet("cacheRepliesTtl.quick_replies") ? getValue("unity", "cacheRepliesTtl.quick_replies") : ""}
                                            search
                                            placeholder={t("schedule.select")}
                                            onChange={(value) => {
                                                validateConfigComplete(value, "cacheRepliesTtl.quick_replies", "unity");

                                                handleSelectUnity("cacheRepliesTtl.quick_replies", value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-b-0.5 border-gray-5 py-6">
                            <div className="flex flex-col px-8 py-3">
                                <div className="flex w-80 flex-col">
                                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.bots.limitQuestions")}</p>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.bots.limitQuestionsText")}</p>
                                </div>
                                <div className="flex">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="maxAttempts"
                                            onChange={(evt) => handleChangeSetting(evt, "number", "VIRTUAL_ASSISTANT")}
                                            value={valueIsSet("maxAttempts") ? getValue("number", "maxAttempts") : ""}
                                            placeholder={t("00")}
                                            className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col px-8 py-3">
                                <div className="flex w-80 flex-col">
                                    <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.bots.limitSessions")}</p>
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.bots.limitSessionsText")}</p>
                                </div>
                                <div className="flex">
                                    <div className="relative">
                                        <input
                                            id="sessionLimitByMonth"
                                            type="number"
                                            onChange={(evt) => handleChangeSetting(evt, "number", "VIRTUAL_ASSISTANT")}
                                            value={valueIsSet("sessionLimitByMonth") ? getValue("number", "sessionLimitByMonth") : ""}
                                            placeholder={t("00")}
                                            className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="my-6 mr-6 flex justify-end">
                    <div className="mt-6 mr-3 flex text-center md:mt-0"></div>
                    <div className="mt-6 flex text-center md:mt-0">
                        <button type="submit" className="button-primary w-32" disabled={loadingUpdateEntity || noBodyData} onClick={handleSubmitConfig}>
                            {loadingUpdateEntity ? <BeatLoader color={"white"} size={"0.625rem"} /> : t("hsm.save")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GeneralBotsSettings;
