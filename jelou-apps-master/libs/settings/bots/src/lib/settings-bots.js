import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import GeneralBotsSettings from "./components/GeneralBotsSettings/GeneralBotsSettings";
import GeneralSettings from "./components/GeneralSettings";
import SidebarBots from "./components/SidebarBots";

import { mergeById } from "@apps/shared/utils";
import { useEffect, useState } from "react";
import AutomaticMessagesVirtualAssitant from "./components/AutomaticMessagesVirtualAssistant/AutomaticMessagesVirtualAssitant";
import ChangeConfigModal from "./components/ChangeConfigModal";
import CrmModule from "./components/CrmModule/CrmModule";
import DuplicateBotConfigModal from "./components/DuplicateBotConfigModal";
import DuplicateConfirmationModal from "./components/DuplicateConfirmationModal";
import GeneralPma from "./components/GeneralPma/GeneralPma";
import PmaAutomaticMessages from "./components/PmaAutomaticsMessages/PmaAutomaticMessages";

function SettingsBots(props) {
    const {
        notifyError,
        notify,
        handleOnClickPremium,
        setKeysToRestore,
        settingsBodyRef,
        settingsBody,
        configSettingsBody,
        searchBotValue,
        loadingSettings,
        loadingBots,
        allBotConfig,
        handleCleanSearch,
        handleSearchBot,
        t,
        bots,
        botsSearchResult,
        actualBot,
        setActualBot,
        setOpenRestoreConfigModal,
        noBodyData,
        settingsValidation,
        setSettingsValidation,
        setSettingsSection,
        settingsSection,
        allowSectionChange,
        setAllowSectionChange,
        loadingUpdateEntity,
        handleSubmitConfig,
        showSavingWarning,
        setShowSavingWarning,
        disableUpdateCRM,
        setDisableUpdateCRM,
    } = props;

    const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
    const [nextSection, setNextSection] = useState();
    const [botToDuplicate, setBotToDuplicate] = useState({});
    const [openChangeConfigModal, setOpenChangeConfigModal] = useState(false);
    const [configInProcess, setConfigInProcess] = useState(false);
    const [columnSelectToConfig, setColumnSelectToConfig] = useState(null);
    const [openDuplicateConfirmation, setOpenDuplicateConfirmation] = useState(false);

    const closeModalConfig = () => {
        setOpenChangeConfigModal(false);
    };

    const timeUnitsOptions = [
        { name: t("settings.seconds"), value: "seconds" },
        { name: t("settings.minutes"), value: "minutes" },
        { name: t("settings.hours"), value: "hours" },
        { name: t("settings.days"), value: "days" },
    ];

    const validateConfigComplete = (value, key, type) => {
        const filteredValidation = settingsValidation.filter((validation) => validation.key === key);
        const actualValidation = first(filteredValidation);
        if (!isEmpty(value) || type === "unity") {
            const obj = {
                key,
                types: [],
            };

            if (!isEmpty(filteredValidation)) {
                if (actualValidation.types.some((value) => value === type)) {
                    return;
                } else {
                    const subject = /^0+$/;
                    if (value.match(subject)) {
                        return;
                    }
                    actualValidation.types.push(type);
                }

                const mergedData = mergeById(settingsValidation, actualValidation, "key");
                setSettingsValidation(mergedData);
            } else {
                obj.types.push(type);
                setSettingsValidation((prev) => [...prev, obj]);
            }
            return;
        }
        if (!isEmpty(actualValidation)) {
            const types = get(actualValidation, "types", []);

            const typeIndex = types?.indexOf(type);
            if (typeIndex >= 0) {
                actualValidation.types?.splice(typeIndex, 1);
                const mergedData = mergeById(settingsValidation, actualValidation, "key");
                setSettingsValidation(mergedData);
            }
        }
    };

    useEffect(() => {
        setSettingsSection("botsGeneral");
    }, []);
    useEffect(() => {
        if (actualBot) {
            configSettingsBody();
        }
    }, [actualBot]);

    useEffect(() => {
        setActualBot(first(bots));
        setBotToDuplicate(first(bots));
    }, [bots]);

    useEffect(() => {
        if (!isEmpty(settingsBody.settings)) {
            if (showSavingWarning || configInProcess) {
                setAllowSectionChange(false);
            } else {
                setAllowSectionChange(true);
            }
        }
    }, [settingsBody.settings, settingsBodyRef, configInProcess]);

    const handleChangeSection = (section) => {
        if (!allowSectionChange && settingsSection !== section) {
            setOpenChangeConfigModal(true);
            setNextSection(section);
        } else {
            setSettingsSection(section);
        }
    };

    const onConfirmChangeSection = () => {
        setShowSavingWarning(false);
        setConfigInProcess(false);
        setSettingsSection(nextSection);
        setOpenChangeConfigModal(false);
        setAllowSectionChange(true);
    };

    const switchSection = (section) => {
        switch (section) {
            case "botsGeneral":
                return (
                    <GeneralBotsSettings
                        handleOnClickPremium={handleOnClickPremium}
                        setKeysToRestore={setKeysToRestore}
                        setSettingsValidation={setSettingsValidation}
                        validateConfigComplete={validateConfigComplete}
                        settingsValidation={settingsValidation}
                        settingsBodyRef={settingsBodyRef}
                        setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                        noBodyData={noBodyData}
                        loadingSettings={loadingSettings}
                        loadingUpdateEntity={loadingUpdateEntity}
                        actualBot={actualBot}
                        allBotConfig={allBotConfig}
                        settingsBody={settingsBody}
                        configSettingsBody={configSettingsBody}
                        handleSubmitConfig={handleSubmitConfig}
                        setOpenDuplicateModal={setOpenDuplicateModal}
                        timeUnitsOptions={timeUnitsOptions}
                    />
                );
            case "automaticMessagesVirtualAssitant":
                return (
                    <AutomaticMessagesVirtualAssitant
                        setKeysToRestore={setKeysToRestore}
                        settingsBodyRef={settingsBodyRef}
                        setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                        noBodyData={noBodyData}
                        loadingSettings={loadingSettings}
                        loadingUpdateEntity={loadingUpdateEntity}
                        actualBot={actualBot}
                        allBotConfig={allBotConfig}
                        handleSubmitConfig={handleSubmitConfig}
                        configSettingsBody={configSettingsBody}
                        settingsBody={settingsBody}
                        setOpenDuplicateModal={setOpenDuplicateModal}
                    />
                );
            case "generalPma":
                return (
                    <GeneralPma
                        handleOnClickPremium={handleOnClickPremium}
                        setKeysToRestore={setKeysToRestore}
                        settingsBodyRef={settingsBodyRef}
                        setOpenDuplicateModal={setOpenDuplicateModal}
                        setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                        loadingSettings={loadingSettings}
                        configSettingsBody={configSettingsBody}
                        allBotConfig={allBotConfig}
                        settingsBody={settingsBody}
                        loadingUpdateEntity={loadingUpdateEntity}
                        handleSubmitConfig={handleSubmitConfig}
                        noBodyData={noBodyData}
                    />
                );
            case "PmaAutomaticMessages":
                return (
                    <PmaAutomaticMessages
                        setKeysToRestore={setKeysToRestore}
                        setSettingsValidation={setSettingsValidation}
                        validateConfigComplete={validateConfigComplete}
                        settingsBodyRef={settingsBodyRef}
                        setOpenDuplicateModal={setOpenDuplicateModal}
                        setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                        timeUnitsOptions={timeUnitsOptions}
                        loadingSettings={loadingSettings}
                        configSettingsBody={configSettingsBody}
                        allBotConfig={allBotConfig}
                        settingsBody={settingsBody}
                        loadingUpdateEntity={loadingUpdateEntity}
                        handleSubmitConfig={handleSubmitConfig}
                        noBodyData={noBodyData}
                    />
                );
            case "CrmModule":
                return (
                    <CrmModule
                        disableUpdateCRM={disableUpdateCRM}
                        setDisableUpdateCRM={setDisableUpdateCRM}
                        settingsSection={settingsSection}
                        showSavingWarning={showSavingWarning}
                        setShowSavingWarning={setShowSavingWarning}
                        settingsBody={settingsBody}
                        columnSelectToConfig={columnSelectToConfig}
                        setColumnSelectToConfig={setColumnSelectToConfig}
                        configInProcess={configInProcess}
                        setConfigInProcess={setConfigInProcess}
                        settingsBodyRef={settingsBodyRef}
                        notifyError={notifyError}
                        notify={notify}
                        configSettingsBody={configSettingsBody}
                        allBotConfig={allBotConfig}
                        handleSubmitConfig={handleSubmitConfig}
                    />
                );
            default:
                break;
        }
    };

    return (
        <>
            <SidebarBots
                setColumnSelectToConfig={setColumnSelectToConfig}
                loadingBots={loadingBots}
                botsSearchResult={botsSearchResult}
                searchBotValue={searchBotValue}
                handleCleanSearch={handleCleanSearch}
                handleSearchBot={handleSearchBot}
                t={t}
                configSettingsBody={configSettingsBody}
                settingsBody={settingsBody}
                setActualBot={setActualBot}
                bots={bots}
            />
            <GeneralSettings t={t} settingsSection={settingsSection} handleChangeSection={handleChangeSection} setSettingsSection={setSettingsSection} configSettingsBody={configSettingsBody} />
            <div className="flex-1 rounded-r-1 bg-white">{switchSection(settingsSection)}</div>
            {openDuplicateModal && (
                <DuplicateBotConfigModal
                    setOpenDuplicateConfirmation={setOpenDuplicateConfirmation}
                    setOpenDuplicateModal={setOpenDuplicateModal}
                    botToDuplicate={botToDuplicate}
                    setBotToDuplicate={setBotToDuplicate}
                />
            )}
            {openDuplicateConfirmation && <DuplicateConfirmationModal actualBot={actualBot} botToDuplicate={botToDuplicate} setOpenDuplicateConfirmation={setOpenDuplicateConfirmation} />}
            {openChangeConfigModal && <ChangeConfigModal closeModalConfig={closeModalConfig} onConfirm={onConfirmChangeSection} />}
        </>
    );
}
export default SettingsBots;
