import { MessageIcon } from "@apps/shared/icons";
import { mergeById } from "@apps/shared/utils";
import { Disclosure, Tab, Transition } from "@headlessui/react";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SelectSearch, { fuzzySearch } from "react-select-search";
import { BeatLoader } from "react-spinners";
import DropDownMenu from "../DropDownMenu";
import AutomaticMessagesSkeleton from "./AutomaticMessagesSkeleton";

const PmaAutomaticMessages = (props) => {
    const {
        setKeysToRestore,
        setSettingsValidation,
        validateConfigComplete,
        settingsBodyRef,
        timeUnitsOptions,
        setOpenDuplicateModal,
        setOpenRestoreConfigModal,
        loadingSettings,
        configSettingsBody,
        allBotConfig,
        settingsBody,
        loadingUpdateEntity,
        handleSubmitConfig,
        noBodyData,
    } = props;
    const { t } = useTranslation();

    const automaticMessagesKeysToRestore = [
        "operatorView.timesLimit.wait",

        "operatorView.messagesToUser.wait",

        "operatorView.messagesToUser.waitMessageIfIsFromOperator",

        "operatorView.tickets.expirationTime",

        "operatorView.messagesToUser.end",

        "operatorView.messagesToUser.endMessageIfIsFromOperator",

        "operatorView.limitTimeOperator",

        "operatorView.tickets.expirationMessage",

        "operatorView.messagesToUser.operatorCloseSession",

        "operatorView.messagesToUser.switchOperator",

        "operatorView.automaticTransfer.timeToTransfer",

        "operatorView.tickets.waitingMessages",
    ];

    const automaticMessagesKeys = [
        {
            key: "operatorView.timesLimit.wait",
        },
        {
            key: "operatorView.messagesToUser.wait",
        },
        {
            key: "operatorView.messagesToUser.waitMessageIfIsFromOperator",
        },
        {
            key: "operatorView.tickets.expirationTime",
        },
        {
            key: "operatorView.messagesToUser.end",
        },
        {
            key: "operatorView.messagesToUser.endMessageIfIsFromOperator",
        },
        {
            key: "operatorView.limitTimeOperator",
        },
        {
            key: "operatorView.tickets.expirationMessage",
        },
        {
            key: "operatorView.messagesToUser.operatorCloseSession",
        },
        {
            key: "operatorView.messagesToUser.switchOperator",
        },
        {
            key: "operatorView.automaticTransfer.timeToTransfer",
        },
        {
            key: "operatorView.tickets.waitingMessages",
        },
    ];

    useEffect(() => {
        setKeysToRestore(automaticMessagesKeysToRestore);
    }, []);
    const getConfigValues = () => {
        const filteredConfigBySection = allBotConfig.filter((configObj) => automaticMessagesKeys.find((obj) => obj.key === configObj.key));
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
        getConfigValues();
    }, [allBotConfig]);

    const handleChangeSetting = (event, typeOf) => {
        // get value associated to key before to do the mergeById (To keep the reference)
        const settings = get(settingsBody, "settings", []);
        const arrayRef = settings.filter((settingObj) => settingObj.key === event.target.id);
        const refUnity = get(first(arrayRef), "unity", null);

        const settingsObj = {
            key: event.target.id,
            typeOf,
            value: typeOf === "boolean" ? event.target.checked : typeOf === "number" && event.target.value !== "" ? Number(event.target.value) : event.target.value,
            unity: refUnity,
            module: "PMA",
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
            typeOf: "number",
            value: refValue,
            unity,
            module: "PMA",
        };
        const temporalSettings = mergeById(settingsBody.settings, settingsObj, "key");
        configSettingsBody("settings", temporalSettings);
    };

    const getValue = (type, key) => {
        const filteredSetting = settingsBody.settings.filter((option) => option.key === key);
        const settingBody = first(filteredSetting);

        if (type === "unity") {
            if (!isEmpty(filteredSetting)) {
                if (!isEmpty(settingBody)) {
                    return settingBody["unity"];
                }

                return;
            }
            return;
        }
        if (type === "number" || type === "string") {
            if (!isEmpty(filteredSetting)) {
                return first(filteredSetting)["value"];
            }
            return "";
        }
        if (type === "checkbox") {
            if (!isEmpty(filteredSetting)) {
                return Boolean(first(filteredSetting)["value"]);
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
            <div className="flex items-center justify-between  border-b-0.5 border-gray-5 py-8 pl-10 pr-6">
                <div className="flex items-center">
                    <MessageIcon className={"mr-4"} fill="#00B3C7" width="1.4rem" height="1.4rem" />
                    <p className={`text-base font-bold text-primary-200`}>{t("settings.atomaticMsg.title")}</p>
                </div>
                <DropDownMenu setOpenDuplicateModal={setOpenDuplicateModal} setOpenRestoreConfigModal={setOpenRestoreConfigModal} />
            </div>
            <div className="h-[85%] overflow-y-auto pl-8 pr-8">
                {loadingSettings ? (
                    <AutomaticMessagesSkeleton />
                ) : (
                    <Tab.Group>
                        <Disclosure defaultOpen={true}>
                            {({ open }) => (
                                <div className="border-b-0.5 border-gray-5 py-6">
                                    <Disclosure.Button className="flex w-full items-center space-x-2 px-5 py-3">
                                        <p className="text-base font-bold text-primary-200">{t("settings.atomaticMsg.durationExp")}</p>
                                        <svg viewBox="0 0 20 20" className={`mr-2 h-5 w-5 fill-current text-primary-200 transition-all ${!open ? "rotate-180 transform" : ""} `}>
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </Disclosure.Button>
                                    <Transition
                                        show={open}
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Disclosure.Panel>
                                            <div className="">
                                                <div className="flex flex-col px-8 py-3">
                                                    <div className="flex w-80 flex-col">
                                                        <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.timeMsgExp")}</p>
                                                        <p className="text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.timeMsgExpDescr")}</p>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                id="operatorView.limitTimeOperator"
                                                                onChange={(evt) => {
                                                                    validateConfigComplete(evt.target.value, evt.target.id, "number");

                                                                    handleChangeSetting(evt, "number", null);
                                                                }}
                                                                value={valueIsSet("operatorView.limitTimeOperator") ? getValue("number", "operatorView.limitTimeOperator") : ""}
                                                                placeholder={t("00")}
                                                                className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                                            />
                                                        </div>
                                                        <div className="relative">
                                                            <SelectSearch
                                                                id="operatorView_limitTimeOperator_unity"
                                                                options={timeUnitsOptions}
                                                                className="moduleSelect timeSelect mt-3 w-32 text-sm"
                                                                filterOptions={fuzzySearch}
                                                                value={valueIsSet("operatorView.limitTimeOperator") ? getValue("unity", "operatorView.limitTimeOperator") : ""}
                                                                onChange={(value) => {
                                                                    validateConfigComplete(value, "operatorView.limitTimeOperator", "unity");

                                                                    handleSelectUnity("operatorView.limitTimeOperator", value);
                                                                }}
                                                                search
                                                                placeholder={t("schedule.select")}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex w-80 flex-col py-3">
                                                        <div className="flex items-center space-x-2 pb-2">
                                                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.msgExp")}</p>
                                                        </div>
                                                        <p className="pb-2 text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.msgExpDescr")}</p>
                                                        <textarea
                                                            id="operatorView.messagesToUser.end"
                                                            value={valueIsSet("operatorView.messagesToUser.end") ? getValue("string", "operatorView.messagesToUser.end") : ""}
                                                            onChange={(event) => {
                                                                handleChangeSetting(event, "string", null);
                                                            }}
                                                            className="resize-none rounded-1 border-1 border-gray-5 p-4 text-gray-400"
                                                            rows={3}
                                                        ></textarea>
                                                    </div>
                                                    <div className="flex w-80 flex-col py-3">
                                                        <div className="flex items-center space-x-2 pb-2">
                                                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.msgExpOprt")}</p>
                                                        </div>
                                                        <p className="pb-2 text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.msgExpOprtDscr")}</p>
                                                        <textarea
                                                            id="operatorView.messagesToUser.endMessageIfIsFromOperator"
                                                            value={
                                                                valueIsSet("operatorView.messagesToUser.endMessageIfIsFromOperator")
                                                                    ? getValue("string", "operatorView.messagesToUser.endMessageIfIsFromOperator")
                                                                    : ""
                                                            }
                                                            onChange={(event) => {
                                                                handleChangeSetting(event, "string", null);
                                                            }}
                                                            className="resize-none rounded-1 border-1 border-gray-5 p-4 text-gray-400"
                                                            rows={3}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </Disclosure.Panel>
                                    </Transition>
                                </div>
                            )}
                        </Disclosure>
                        <Disclosure defaultOpen={true}>
                            {({ open }) => (
                                <div className="border-b-0.5 border-gray-5 py-6">
                                    <Disclosure.Button className="flex w-full items-center space-x-2 px-5 py-3">
                                        <p className="text-base font-bold text-primary-200">{t("settings.atomaticMsg.warningLogOut")}</p>
                                        <svg viewBox="0 0 20 20" className={`mr-2 h-5 w-5 fill-current text-primary-200 transition-all ${!open ? "rotate-180 transform" : ""} `}>
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </Disclosure.Button>
                                    <Transition
                                        show={open}
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Disclosure.Panel>
                                            <div className="">
                                                <div className="flex flex-col px-8 py-3">
                                                    <div className="flex w-80 flex-col">
                                                        <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.timeMsgWarn")}</p>
                                                        <p className="text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.timeMsgWarnDescr")}</p>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="relative">
                                                            <input
                                                                id="operatorView.timesLimit.wait"
                                                                type="number"
                                                                onChange={(evt) => {
                                                                    validateConfigComplete(evt.target.value, evt.target.id, "number");

                                                                    handleChangeSetting(evt, "number", null);
                                                                }}
                                                                value={valueIsSet("operatorView.timesLimit.wait") ? getValue("number", "operatorView.timesLimit.wait") : ""}
                                                                placeholder={t("00")}
                                                                className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                                            />
                                                        </div>
                                                        <div className="relative">
                                                            <SelectSearch
                                                                id="operatorView_timesLimit_wait_unity"
                                                                options={timeUnitsOptions}
                                                                className="moduleSelect timeSelect mt-3 w-32 text-sm"
                                                                filterOptions={fuzzySearch}
                                                                value={valueIsSet("operatorView.timesLimit.wait") ? getValue("unity", "operatorView.timesLimit.wait") : ""}
                                                                onChange={(value) => {
                                                                    validateConfigComplete(value, "operatorView.timesLimit.wait", "unity");

                                                                    handleSelectUnity("operatorView.timesLimit.wait", value);
                                                                }}
                                                                search
                                                                placeholder={t("schedule.select")}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex w-80 flex-col py-3">
                                                        <div className="flex items-center space-x-2 pb-2">
                                                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.alertMsg")}</p>
                                                        </div>
                                                        <p className="pb-2 text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.alertMsgDescr")}</p>
                                                        <textarea
                                                            id="operatorView.messagesToUser.wait"
                                                            value={valueIsSet("operatorView.messagesToUser.wait") ? getValue("string", "operatorView.messagesToUser.wait") : ""}
                                                            onChange={(event) => {
                                                                handleChangeSetting(event, "string", null);
                                                            }}
                                                            className="resize-none rounded-1 border-1 border-gray-5 p-4 text-gray-400"
                                                            rows={3}
                                                        ></textarea>
                                                    </div>
                                                    <div className="flex w-80 flex-col py-3">
                                                        <div className="flex items-center space-x-2 pb-2">
                                                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.waitMsg")}</p>
                                                        </div>
                                                        <p className="pb-2 text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.waitMsgDescr")}</p>
                                                        <textarea
                                                            placeholder=""
                                                            id="operatorView.messagesToUser.waitMessageIfIsFromOperator"
                                                            value={
                                                                valueIsSet("operatorView.messagesToUser.waitMessageIfIsFromOperator")
                                                                    ? getValue("string", "operatorView.messagesToUser.waitMessageIfIsFromOperator")
                                                                    : ""
                                                            }
                                                            onChange={(event) => {
                                                                handleChangeSetting(event, "string", null);
                                                            }}
                                                            className="resize-none rounded-1 border-1 border-gray-5 p-4 text-gray-400"
                                                            rows={3}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </Disclosure.Panel>
                                    </Transition>
                                </div>
                            )}
                        </Disclosure>
                        <Disclosure defaultOpen={true}>
                            {({ open }) => (
                                <div className="border-b-0.5 border-gray-5 py-6">
                                    <Disclosure.Button className="flex w-full items-center space-x-2 px-5 py-3">
                                        <p className="text-base font-bold text-primary-200">{t("settings.atomaticMsg.queueTime")}</p>
                                        <svg viewBox="0 0 20 20" className={`mr-2 h-5 w-5 fill-current text-primary-200 transition-all ${!open ? "rotate-180 transform" : ""} `}>
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </Disclosure.Button>
                                    <Transition
                                        show={open}
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Disclosure.Panel>
                                            <div className="">
                                                <div className="flex flex-col px-8 py-3">
                                                    <div className="flex w-80 flex-col">
                                                        <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.queueWaitTime")}</p>
                                                        <p className="text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.queueWaitTimeDescr")}</p>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="relative">
                                                            <input
                                                                id="operatorView.tickets.expirationTime"
                                                                type="number"
                                                                onChange={(evt) => {
                                                                    validateConfigComplete(evt.target.value, evt.target.id, "number");

                                                                    handleChangeSetting(evt, "number", null);
                                                                }}
                                                                value={valueIsSet("operatorView.tickets.expirationTime") ? getValue("number", "operatorView.tickets.expirationTime") : ""}
                                                                placeholder={t("00")}
                                                                className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                                            />
                                                        </div>
                                                        <div className="relative">
                                                            <SelectSearch
                                                                id="operatorView_tickets_expirationTime_unity"
                                                                options={timeUnitsOptions}
                                                                className="moduleSelect timeSelect mt-3 w-32 text-sm"
                                                                filterOptions={fuzzySearch}
                                                                value={valueIsSet("operatorView.tickets.expirationTime") ? getValue("unity", "operatorView.tickets.expirationTime") : ""}
                                                                onChange={(value) => {
                                                                    validateConfigComplete(value, "operatorView.tickets.expirationTime", "unity");

                                                                    handleSelectUnity("operatorView.tickets.expirationTime", value);
                                                                }}
                                                                search
                                                                placeholder={t("schedule.select")}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex w-80 flex-col py-3">
                                                        <div className="flex items-center space-x-2 pb-2">
                                                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.queueMsgExp")}</p>
                                                        </div>
                                                        <p className="pb-2 text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.queueMsgExpDescr")}</p>
                                                        <textarea
                                                            id="operatorView.tickets.expirationMessage"
                                                            value={valueIsSet("operatorView.tickets.expirationMessage") ? getValue("string", "operatorView.tickets.expirationMessage") : ""}
                                                            onChange={(event) => {
                                                                handleChangeSetting(event, "string", null);
                                                            }}
                                                            className="resize-none rounded-1 border-1 border-gray-5 p-4 text-gray-400"
                                                            rows={3}
                                                        ></textarea>
                                                    </div>
                                                    <div className="flex w-80 flex-col py-3">
                                                        <div className="flex items-center space-x-2 pb-2">
                                                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.waitMsgUsers")}</p>
                                                        </div>
                                                        <p className="pb-2 text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.waitMsgUsersDescr")}</p>
                                                        <textarea
                                                            placeholder=""
                                                            id="operatorView.tickets.waitingMessages"
                                                            value={valueIsSet("operatorView.tickets.waitingMessages") ? getValue("string", "operatorView.tickets.waitingMessages") : ""}
                                                            onChange={(event) => {
                                                                handleChangeSetting(event, "string", null);
                                                            }}
                                                            className="resize-none rounded-1 border-1 border-gray-5 p-4 text-gray-400"
                                                            rows={3}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </Disclosure.Panel>
                                    </Transition>
                                </div>
                            )}
                        </Disclosure>
                        <Disclosure defaultOpen={true}>
                            {({ open }) => (
                                <div className="border-b-0.5 border-gray-5 py-6">
                                    <Disclosure.Button className="flex w-full items-center space-x-2 px-5 py-3">
                                        <p className="text-base font-bold text-primary-200">{t("settings.atomaticMsg.caseTransfer")}</p>
                                        <svg viewBox="0 0 20 20" className={`mr-2 h-5 w-5 fill-current text-primary-200 transition-all ${!open ? "rotate-180 transform" : ""} `}>
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </Disclosure.Button>
                                    <Transition
                                        show={open}
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Disclosure.Panel>
                                            <div className="">
                                                <div className="flex flex-col px-8 py-3">
                                                    <div className="flex w-80 flex-col">
                                                        <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.timeTransfer")}</p>
                                                        <p className="text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.timeTransferDescr")}</p>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="relative">
                                                            <input
                                                                id="operatorView.automaticTransfer.timeToTransfer"
                                                                type="number"
                                                                onChange={(evt) => {
                                                                    validateConfigComplete(evt.target.value, evt.target.id, "number");

                                                                    handleChangeSetting(evt, "number", null);
                                                                }}
                                                                value={
                                                                    valueIsSet("operatorView.automaticTransfer.timeToTransfer")
                                                                        ? getValue("number", "operatorView.automaticTransfer.timeToTransfer")
                                                                        : ""
                                                                }
                                                                placeholder={t("00")}
                                                                className={`mt-3 mr-2 w-32 rounded-xs border-none bg-primary-700 text-15 font-normal text-gray-400 placeholder:text-opacity-50 focus:border-transparent focus:ring-transparent focus-visible:outline-none`}
                                                            />
                                                        </div>
                                                        <div className="relative">
                                                            <SelectSearch
                                                                id="operatorView_automaticTransfer_timeToTransfer_unity"
                                                                options={timeUnitsOptions}
                                                                className="moduleSelect timeSelect mt-3 w-32 text-sm"
                                                                filterOptions={fuzzySearch}
                                                                value={
                                                                    valueIsSet("operatorView.automaticTransfer.timeToTransfer")
                                                                        ? getValue("unity", "operatorView.automaticTransfer.timeToTransfer")
                                                                        : ""
                                                                }
                                                                onChange={(value) => {
                                                                    validateConfigComplete(value, "operatorView.automaticTransfer.timeToTransfer", "unity");
                                                                    handleSelectUnity("operatorView.automaticTransfer.timeToTransfer", value);
                                                                }}
                                                                search
                                                                placeholder={t("schedule.select")}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex w-80 flex-col py-3">
                                                        <div className="flex items-center space-x-2 pb-2">
                                                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.timeTransferOprt")}</p>
                                                        </div>
                                                        <p className="pb-2 text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.timeTransferOprtDescr")}</p>
                                                        <textarea
                                                            id="operatorView.messagesToUser.switchOperator"
                                                            value={valueIsSet("operatorView.messagesToUser.switchOperator") ? getValue("string", "operatorView.messagesToUser.switchOperator") : ""}
                                                            onChange={(event) => {
                                                                handleChangeSetting(event, "string", null);
                                                            }}
                                                            className="resize-none rounded-1 border-1 border-gray-5 p-4 text-gray-400"
                                                            rows={3}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </Disclosure.Panel>
                                    </Transition>
                                </div>
                            )}
                        </Disclosure>
                    </Tab.Group>
                )}

                <div className="border-b-0.5 border-gray-5 py-6">
                    <div className="mx-8 flex w-80 flex-col py-3 ">
                        <div className="flex items-center space-x-2 pb-2">
                            <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("settings.atomaticMsg.closeMsgOprt")}</p>
                        </div>
                        <p className="pb-2 text-sm text-gray-400 text-opacity-80">{t("settings.atomaticMsg.closeMsgOprtDescr")}</p>
                        <textarea
                            placeholder=""
                            id="operatorView.messagesToUser.operatorCloseSession"
                            value={valueIsSet("operatorView.messagesToUser.operatorCloseSession") ? getValue("string", "operatorView.messagesToUser.operatorCloseSession") : ""}
                            onChange={(event) => {
                                handleChangeSetting(event, "string", null);
                            }}
                            className="resize-none rounded-1 border-1 border-gray-5 p-4 text-gray-400"
                            rows={3}
                        ></textarea>
                    </div>
                </div>
                <div className="my-6 mr-6 flex justify-end">
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

export default PmaAutomaticMessages;
