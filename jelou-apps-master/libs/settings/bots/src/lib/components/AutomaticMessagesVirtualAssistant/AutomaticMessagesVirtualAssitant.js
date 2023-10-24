import { MessageIcon } from "@apps/shared/icons";
import { mergeById } from "@apps/shared/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BeatLoader } from "react-spinners";
import DropDownMenu from "../DropDownMenu";
import AutomaticMessagesConfig from "./AutomaticMessagesConfig";
import AutomaticMessagesSkeleton from "./AutomaticMessagesSkeleton";

const AutomaticMessagesVirtualAssitant = (props) => {
    const {
        setKeysToRestore,

        settingsBodyRef,
        actualBot,
        noBodyData,
        allBotConfig,
        loadingUpdateEntity,
        configSettingsBody,
        settingsBody,
        setOpenDuplicateModal,
        loadingSettings,
        setOpenRestoreConfigModal,
        handleSubmitConfig,
    } = props;

    const { t } = useTranslation();

    const automaticMessagesVirtualAssitantToRestore = [
        "whatsapp_messages.noValidOptionMessage",
        "whatsapp_messages.leaveMenuMessage",
        "whatsapp_messages.menuMessageInteractive",
        "whatsapp_messages.menuMessage",
        "cancelExpressions",
        "cancelExpressionsMessage",
        "sessionExpiredMessages.option",
        "sessionExpiredMessages.input",
        "maxAttemptsMessage",
    ];

    const automaticMessagesVirtualAssitant = [
        {
            key: "whatsapp_messages.noValidOptionMessage",
            displayName: t("settings.botsMsgAuto.msgInvalid"),
            description: t("settings.botsMsgAuto.msgInvalidDescr"),
        },
        {
            key: "whatsapp_messages.leaveMenuMessage",
            displayName: t("settings.botsMsgAuto.msgOutOpc"),
            description: t("settings.botsMsgAuto.msgOutOpcDescr"),
        },
        {
            key: "whatsapp_messages.menuMessageInteractive",
            displayName: t("settings.botsMsgAuto.msgListOpc"),
            description: t("settings.botsMsgAuto.msgListOpcDescr"),
        },
        {
            key: "whatsapp_messages.menuMessage",
            displayName: t("settings.botsMsgAuto.msgSeltOpc"),
            description: t("settings.botsMsgAuto.msgSelOpcDescr"),
        },
        {
            key: "cancelExpressions",
            displayName: t("settings.botsMsgAuto.outputWords"),
            description: t("settings.botsMsgAuto.outputWordsDescr"),
        },
        {
            key: "cancelExpressionsMessage",
            displayName: t("settings.botsMsgAuto.msgOutQuestions"),
            description: t("settings.botsMsgAuto.msgOutQuestionsDescr"),
        },
        {
            key: "sessionExpiredMessages.option",
            displayName: t("settings.botsMsgAuto.msgOpcExp"),
            description: t("settings.botsMsgAuto.msgOpcExpDescr"),
        },
        {
            key: "sessionExpiredMessages.input",
            displayName: t("settings.botsMsgAuto.msgQuestionExp"),
            description: t("settings.botsMsgAuto.msgQuestionExpDescr"),
        },
        {
            key: "maxAttemptsMessage",
            displayName: t("settings.botsMsgAuto.msgMaxTry"),
            description: t("settings.botsMsgAuto.msgMaxTryDescr"),
        },
    ];
    const getConfigValues = () => {
        const filteredConfigBySection = allBotConfig.filter((configObj) => automaticMessagesVirtualAssitant.find((obj) => obj.key === configObj.key));
        configSettingsBody("settings", filteredConfigBySection);
        settingsBodyRef.current = filteredConfigBySection;
    };

    useEffect(() => {
        setKeysToRestore(automaticMessagesVirtualAssitantToRestore);
    }, []);

    useEffect(() => {
        getConfigValues();
    }, [allBotConfig]);

    const handleChangeSetting = (event, typeOf, unity) => {
        let settingsObj = {};

        settingsObj = {
            key: event.target.id,
            typeOf,
            value: event.target.value,
            unity,
            module: "VIRTUAL_ASSISTANT",
        };

        const temporalSettings = mergeById(settingsBody.settings, settingsObj, "key");
        configSettingsBody("settings", temporalSettings);
    };

    return (
        <>
            <div className="flex w-full items-center justify-between border-b-0.5 border-gray-5 py-8 pl-10 pr-6">
                <div className="flex items-center">
                    <MessageIcon className={"mr-4"} fill="#00B3C7" width="1.4rem" height="1.4rem" />
                    <p className={`text-base font-bold text-primary-200`}>{t("Mensajes automaticos")}</p>
                </div>
                <DropDownMenu setOpenDuplicateModal={setOpenDuplicateModal} setOpenRestoreConfigModal={setOpenRestoreConfigModal} />
            </div>
            <div className="h-[85%] w-full overflow-y-auto py-6 pl-8 pr-8">
                <div className="pl-8">
                    {loadingSettings ? (
                        <AutomaticMessagesSkeleton />
                    ) : (
                        automaticMessagesVirtualAssitant.map((objInfo, index) => {
                            return (
                                <AutomaticMessagesConfig
                                    key={index}
                                    actualBot={actualBot}
                                    generalData={objInfo}
                                    configData={allBotConfig}
                                    settingsBody={settingsBody}
                                    handleChangeSetting={handleChangeSetting}
                                />
                            );
                        })
                    )}
                </div>
                <div className="mt-6 flex justify-end border-t-0.5 border-gray-5 pr-6 pt-6">
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

export default AutomaticMessagesVirtualAssitant;
