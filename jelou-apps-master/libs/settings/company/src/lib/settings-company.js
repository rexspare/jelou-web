import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toUpper from "lodash/toUpper";
import CompanySidebar from "./components/company-sidebar";
import SettingsMenu from "./components/company-settings-menu/company-settings-menu";
import GeneralSettings from "./components/company-general-settings/company-general-settings";
import { COMPANY_SETTINGS } from "@apps/shared/constants";

export function SettingsCompany(props) {
    const {
        settingsSection,
        setSettingsSection,
        loadingSettings,
        actualBot,
        setOpenRestoreConfigModal,
        setKeysToRestore,
        settingsBodyRef,
        configSettingsBody,
        allBotConfig,
        bots,
        loadingUpdateEntity,
        setActualBot,
        settingsBody,
        handleSubmitConfig,
        noBodyData,
    } = props;

    const company = useSelector((state) => state.company);
    const [loadingCompany, setLoadingCompany] = useState(false);
    const [allowSectionChange, setAllowSectionChange] = useState(true);
    // const [settingsSection, setSettingsSection] = useState(COMPANY_SETTINGS.GENERAL);
    const [openChangeConfigModal, setOpenChangeConfigModal] = useState(false);
    const [nextSection, setNextSection] = useState();

    const handleChangeSection = (section) => {
        if (!allowSectionChange && settingsSection !== section) {
            setOpenChangeConfigModal(true);
            setNextSection(section);
        } else {
            setSettingsSection(section);
        }
    };

    useEffect(() => {
        setSettingsSection(COMPANY_SETTINGS.GENERAL);
    }, []);

    useEffect(() => {
        if (actualBot) {
            configSettingsBody();
        }
    }, [actualBot]);

    const switchSection = (section) => {
        switch (toUpper(section)) {
            case COMPANY_SETTINGS.GENERAL:
                return (
                    <GeneralSettings
                        loadingSettings={loadingSettings}
                        loadingUpdateEntity={loadingUpdateEntity}
                        setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                        setKeysToRestore={setKeysToRestore}
                        handleSubmitConfig={handleSubmitConfig}
                        noBodyData={noBodyData}
                        bots={bots}
                        setActualBot={setActualBot}
                        settingsBodyRef={settingsBodyRef}
                        allBotConfig={allBotConfig}
                        settingsBody={settingsBody}
                        configSettingsBody={configSettingsBody}
                    />
                );
            default:
                break;
        }
    };
    return (
        <>
            <CompanySidebar company={company} loadingCompany={loadingCompany} />
            <SettingsMenu settingsSection={settingsSection} handleChangeSection={handleChangeSection} setSettingsSection={setSettingsSection} />
            <div className="flex-1 rounded-r-1 bg-white">{switchSection(settingsSection)}</div>
        </>
    );
}
export default SettingsCompany;
