import { CheckCircleIcon } from "@apps/shared/icons";
import { mergeById } from "@apps/shared/utils";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectSearch, { fuzzySearch } from "react-select-search";
import { BeatLoader } from "react-spinners";
import DropDownMenu from "../DropDownMenu";
import GeneralPmaSkeleton from "./GeneralPmaSkeleton";
import InputSetting from "./InputSetting";

const GeneralPma = (props) => {
    const {
        settingsBodyRef,
        setKeysToRestore,

        configSettingsBody,
        setOpenDuplicateModal,
        setOpenRestoreConfigModal,
        loadingSettings,
        settingsBody,
        allBotConfig,
        loadingUpdateEntity,
        handleSubmitConfig,
        noBodyData,
        handleOnClickPremium,
    } = props;

    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const handleChangeSetting = (event, typeOf) => {
        const settingsObj = {
            key: event.target.id,
            typeOf,
            value: typeOf !== "boolean" ? event.target.value : event.target.checked,
            unity: null,
            module: "PMA",
        };
        const temporalSettings = mergeById(settingsBody.settings, settingsObj, "key");
        configSettingsBody("settings", temporalSettings);
    };

    const { t } = useTranslation();

    const getConfigValues = () => {
        const filteredConfigBySection = allBotConfig.filter((configObj) => generalPmaKeys.find((obj) => obj.key === configObj.key));
        configSettingsBody("settings", filteredConfigBySection);
        settingsBodyRef.current = filteredConfigBySection;
    };

    useEffect(() => {
        setKeysToRestore(generalPmaKeysToRestore);
    }, []);
    useEffect(() => {
        getConfigValues();
    }, [allBotConfig]);

    const getValue = (type, key) => {
        const filteredOptions = settingsBody.settings.filter((option) => option.key === key);
        if (type === "unity") {
            if (!isEmpty(filteredOptions)) {
                return first(filteredOptions)["unity"];
            }
            return;
        }
        if (type === "number" || type === "string") {
            if (!isEmpty(filteredOptions)) {
                return first(filteredOptions)["value"];
            }
            return;
        }
        if (type === "checkbox") {
            if (!isEmpty(filteredOptions)) {
                return Boolean(first(filteredOptions)["value"]);
            }
            return;
        }
    };
    const valueIsSet = (key) => {
        const selectedValuesFiltered = settingsBody.settings.filter((selectedValue) => selectedValue.key === key);
        return !isEmpty(selectedValuesFiltered);
    };

    const generalPmaKeysToRestore = ["operatorView.enableCalls", "operatorView.enableVideoCalls", "sendAudio", "operatorView.byTeam", "operatorView.canRecoverChat", "isEnableSessionExpiration"];

    const generalPmaKeys = [
        {
            key: "operatorView.enableCalls",
        },
        {
            key: "operatorView.enableVideoCalls",
        },
        {
            key: "sendAudio",
        },
        {
            key: "operatorView.byTeam",
        },
        {
            key: "operatorView.canRecoverChat",
        },
    ];

    const inputSettings = [
        {
            key: "operatorView.enableCalls",
            displayName: t("settings.mapGen.calls"),
            description: t("settings.mapGen.callsDescr"),
            premiumFeature: true,
        },
        {
            key: "operatorView.enableVideoCalls",
            displayName: t("settings.mapGen.videocalls"),
            description: t("settings.mapGen.videocallsDescr"),
            premiumFeature: true,
        },
        {
            key: "sendAudio",
            displayName: t("settings.mapGen.voiceNotes"),
            description: t("settings.mapGen.voiceNotesDescr"),
            premiumFeature: false,
        },
        {
            key: "operatorView.canRecoverChat",
            displayName: t("settings.mapGen.contactButton"),
            description: t("settings.mapGen.contactButtonDescr"),
            premiumFeature: false,
        },
    ];

    const transferOptions = [
        { name: t("roles.Operador"), value: "operator" },
        { name: t("monitoring.team"), value: "team" },
    ];
    const handleSelectValue = (key, value) => {
        const settingsObj = {
            key,
            typeOf: "boolean",
            value,
            unity: null,
            module: "PMA",
        };
        const temporalSettings = mergeById(settingsBody.settings, settingsObj, "key");
        configSettingsBody("settings", temporalSettings);
    };

    const handleSelectTransferType = (value) => {
        const booleanValue = value === "team";

        handleSelectValue("operatorView.byTeam", booleanValue);
    };

    const getTransferType = () => {
        const dataBaseValue = getValue("checkbox", "operatorView.byTeam");
        if (dataBaseValue === true) {
            return "team";
        } else {
            return "operator";
        }
    };

    return (
        <>
            <div className="flex items-center justify-between border-b-0.5 border-gray-5 py-8 pl-10 pr-6">
                <div className="flex items-center">
                    <CheckCircleIcon className={"mr-4 text-primary-200"} width="1.2rem" height="1.4rem" />
                    <p className={`text-base font-bold text-primary-200`}>{t("settings.mapGen.configMap")}</p>
                </div>
                <DropDownMenu setOpenDuplicateModal={setOpenDuplicateModal} setOpenRestoreConfigModal={setOpenRestoreConfigModal} />
            </div>
            <div className="h-[85%] overflow-y-auto pl-8 pr-8">
                {loadingSettings ? (
                    <GeneralPmaSkeleton />
                ) : (
                    <>
                        <div className="border-b-0.5 border-gray-5 py-6">
                            {inputSettings.map((settingInfo, index) => (
                                <InputSetting
                                    handleOnClickPremium={handleOnClickPremium}
                                    key={index}
                                    settingInfo={settingInfo}
                                    handleChangeSetting={handleChangeSetting}
                                    valueIsSet={valueIsSet}
                                    getValue={getValue}
                                />
                            ))}
                        </div>
                        <div className="flex px-6 pt-8">
                            <label className="ml-3 flex w-80 flex-col hover:cursor-pointer" htmlFor={"hasBroadcast"}>
                                <p className="text-15 font-bold text-gray-400 text-opacity-80">{t("monitoring.Transferencia")}</p>
                                <p className="text-sm text-gray-400 text-opacity-80">{t("settings.mapGen.transferDescr")}</p>
                            </label>
                        </div>
                        <div
                            className="flex border-b-0.5 border-gray-5
                pl-[3.5rem] pt-4 pb-8"
                        >
                            <label className="ml-3 w-80 flex-col items-center">
                                <div className="mb-3 flex items-center">
                                    <p className="mr-3 text-15 font-bold text-gray-400 text-opacity-80">{t("settings.mapGen.transferBy")}</p>
                                    <div className="relative w-70">
                                        <SelectSearch
                                            menuIsOpen={menuIsOpen}
                                            onMenuOpen={() => setMenuIsOpen(true)}
                                            onMenuClose={() => setMenuIsOpen(false)}
                                            id="operatorView.byTeam"
                                            options={transferOptions}
                                            className="moduleSelect timeSelect w-full text-sm"
                                            filterOptions={fuzzySearch}
                                            value={valueIsSet("operatorView.byTeam") ? getTransferType() : "operator"}
                                            onChange={(value) => {
                                                handleSelectTransferType(value);
                                            }}
                                            search
                                            placeholder={t("schedule.select")}
                                        />
                                    </div>
                                </div>
                                {valueIsSet("operatorView.byTeam") && getTransferType() === "team" ? (
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.mapGen.transferByText2")}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 text-opacity-80">{t("settings.mapGen.transferByText1")}</p>
                                )}
                            </label>
                        </div>
                    </>
                )}

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

export default GeneralPma;
