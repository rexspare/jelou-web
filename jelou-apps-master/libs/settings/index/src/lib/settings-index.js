import { getBots } from "@apps/redux/store";
import SettingsBots from "@apps/settings/bots";
import CompanySettings from "@apps/settings/company";
import SettingsSchedules from "@apps/settings/schedules";
import { PremiumFeaturesModal, RestoreConfigModal } from "@apps/settings/shared";
import TeamsSettings from "@apps/settings/teams";
import { Menu } from "@apps/shared/common";
import { JelouApiV1 } from "@apps/shared/modules";
import { getTimeByUnity, getTimeInSeconds, mergeById } from "@apps/shared/utils";
import Fuse from "fuse.js";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import last from "lodash/last";
import toUpper from "lodash/toUpper";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function SettingsIndex(props) {
    const { t } = useTranslation();
    const lang = get(localStorage, "lang", "es");
    const { permissionsList } = props;
    const { tab } = useParams();
    const location = useLocation();
    const tabFromPath = last(location.pathname.split("/"));

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const company = useSelector((state) => state.company);
    const companyId = get(company, "id");
    const userSession = useSelector((state) => state.userSession);
    const monitorAllTeams = get(userSession, "monitorAllTeams", false);

    const [menuOptions, setMenuOptions] = useState([]);
    const [currentOptionId, setCurrentOptionId] = useState(0);
    const [tabs, setTabs] = useState(tab === undefined ? tabFromPath : tab);
    const [searchBotValue, setSearchBotValue] = useState("");
    const [botsSearchResult, setBotsSearchResult] = useState();
    const [loadingBots, setLoadingBots] = useState(false);
    const [allBotConfig, setAllBotConfig] = useState([]);
    const [loadingSettings, setLoadingSettings] = useState(false);
    const [actualBot, setActualBot] = useState({});
    const [settingsValidation, setSettingsValidation] = useState([]);
    const [settingsSection, setSettingsSection] = useState("");
    const [loadingUpdateEntity, setLoadingUpdateEntity] = useState(false);
    const [allowSectionChange, setAllowSectionChange] = useState(true);
    const [openRestoreConfigModal, setOpenRestoreConfigModal] = useState(false);
    const [keysToRestore, setKeysToRestore] = useState({});
    const [selectedTeam, setSelectedTeam] = useState("");
    const [openPremiumFeatureModal, setOpenPremiumFeatureModal] = useState(false);
    const [featureToUnlock, setFeatureToUnlock] = useState("");
    const [showSavingWarning, setShowSavingWarning] = useState(false);
    const [disableUpdateCRM, setDisableUpdateCRM] = useState(true);

    const [settingsBody, setSettingBody] = useState({
        entity: {
            type: "",
            id: "",
        },
        settings: [],
    });

    const permissions = useSelector((state) => state.permissions);
    const botsSettingsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "settings:view_bot_settings") : "";
    const teamSettingsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "settings:team_settings") : "";
    const companySettingsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "settings:company_settings") : "";
    const schedulesPermission = !isEmpty(permissions) ? permissions.find((data) => data === "schedules:view_schedule") : "";

    const [bots, setBots] = useState();

    const settingsPermissionsList = [botsSettingsPermission, teamSettingsPermission, companySettingsPermission, schedulesPermission];
    const botId = get(actualBot, "id", "");

    const allowSaving = () => {
        return !settingsValidation.some((validationObj) => validationObj.types.length !== 2);
    };

    const noBodyData = isEmpty(settingsBody.settings);

    const settingsBodyRef = useRef(null);

    const configSettingsBody = (mainKey, value) => {
        const actualBotId = get(actualBot, "id", "");
        const teamId = get(selectedTeam, "id", "");
        let entityType;
        let entityId;
        if (tabFromPath === "bots") {
            entityType = "BOT";
            entityId = actualBotId;
        }

        if (tabFromPath === "company") {
            entityType = "COMPANY";
            entityId = companyId;
        }
        if (tabFromPath === "teams") {
            entityType = "TEAM";
            entityId = teamId;
        }

        setSettingBody({ ...settingsBody, entity: { ...settingsBody.entity, id: entityId, type: entityType } });
        switch (mainKey) {
            case "entity":
                break;
            case "settings":
                setSettingBody({ ...settingsBody, settings: value });
                break;
            case "sidebar_settings":
                setSettingBody({ ...settingsBody, settings: [value] });
                break;
            default:
                break;
        }
    };

    const getEntityConfig = async () => {
        const teamId = get(selectedTeam, "id", "");

        const actualBotId = get(actualBot, "id", "");
        let entityType;
        let entityId;
        if (tabFromPath === "bots") {
            entityType = "BOT";
            entityId = actualBotId;
        }

        if (tabFromPath === "company") {
            entityType = "COMPANY";
            entityId = companyId;
        }

        if (tabFromPath === "teams") {
            entityType = "TEAM";
            entityId = teamId;
        }

        setLoadingSettings(true);
        try {
            const { data } = await JelouApiV1.get(`settings/${entityId}`, {
                params: {
                    type: entityType,
                },
            });

            const { data: dataConfig } = data;

            const timeSettings = dataConfig.filter((configObj) => configObj.unity !== null);
            if (!isEmpty(timeSettings)) {
                const timeSettingsConverted = timeSettings.map((configObj) => {
                    const valueConverted = getTimeByUnity(configObj.value, configObj.unity);
                    const temporalConfigObj = { ...configObj };
                    temporalConfigObj.value = valueConverted;
                    return temporalConfigObj;
                });

                let dataConfigParsed = [...dataConfig];
                timeSettingsConverted.forEach((configObj) => {
                    dataConfigParsed = mergeById(dataConfigParsed, configObj, "key");
                });

                setAllBotConfig(dataConfigParsed);
            } else {
                setAllBotConfig(dataConfig);
            }

            setLoadingSettings(false);
        } catch (error) {
            setLoadingSettings(false);
            console.log(error);
        }
    };

    const notify = (msg) => {
        toast.success(msg, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    const notifyError = (errorMsg) => {
        toast.error(errorMsg, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    const updateConfigUI = () => {
        // This function keeps data updated without the need to call the endpoint again
        const newSettings = get(settingsBody, "settings", []);
        let finalConfig = [...allBotConfig];
        newSettings.forEach((obj) => {
            finalConfig = mergeById(finalConfig, obj, "key");
        });
        setAllBotConfig(finalConfig);
    };

    const updateEntityConfig = async () => {
        if (allowSaving()) {
            if (settingsSection === "botsGeneral" || settingsSection === "PmaAutomaticMessages") {
                unsetInputWarning(settingsValidation);
            }
            let settingsBodyReference = { ...settingsBody };

            if (settingsSection !== "CrmModule") {
                const timeSettings = settingsBody.settings.filter((configObj) => configObj.unity !== null);
                const timeSettingsInSeconds = timeSettings.map((configObj) => {
                    const valueInSeconds = getTimeInSeconds(configObj.value, configObj.unity);
                    const temporalConfigObj = { ...configObj };
                    temporalConfigObj.value = valueInSeconds;
                    return temporalConfigObj;
                });

                timeSettingsInSeconds.forEach((configObj) => {
                    settingsBodyReference.settings = mergeById(settingsBodyReference.settings, configObj, "key");
                });
            }

            setLoadingUpdateEntity(true);
            try {
                await JelouApiV1.post("/settings", settingsBodyReference);

                notify(t("notifyMessages.savedChanges"));
                if (settingsSection !== "CrmModule") {
                    updateConfigUI();
                }
                setLoadingUpdateEntity(false);
                setAllowSectionChange(true);
                if (settingsSection === "CrmModule") {
                    setShowSavingWarning(false);
                    setDisableUpdateCRM(true);
                }
            } catch (error) {
                setLoadingUpdateEntity(false);

                console.log(error);
            }
        } else {
            notifyError(t("Los campos señalados en rojo estan incompletos"));
            if (settingsSection === "botsGeneral" || settingsSection === "PmaAutomaticMessages") {
                setInputWarning(settingsValidation);
            }
        }
    };

    const restoreConfig = async () => {
        const actualBotId = get(actualBot, "id", "");

        let entityType;
        let entityId;
        if (tabFromPath === "bots") {
            entityType = "BOT";
            entityId = actualBotId;
        }

        if (tabFromPath === "company") {
            entityType = "COMPANY";
            entityId = companyId;
        }

        const payload = {
            entity: {
                type: entityType,
                id: entityId,
            },
            keys: keysToRestore,
        };

        try {
            await JelouApiV1.put("settings/restore", payload);
            getEntityConfig();
            setOpenRestoreConfigModal(false);
            notify("La configuracion ha sido restablecida correctamente");
        } catch (error) {
            console.log(error);
            setOpenRestoreConfigModal(false);
        }
    };

    const closeRestoreModal = () => {
        setOpenRestoreConfigModal(false);
    };

    const handleSubmitConfig = () => {
        updateEntityConfig();
    };

    function setInputWarning(settingsArray) {
        settingsArray.forEach((element) => {
            if (element.types.length !== 2) {
                let inputIncomplete;
                if (first(element.types) === "unity") {
                    inputIncomplete = document.getElementById(element.key);
                    inputIncomplete.classList.remove("border-none");
                    inputIncomplete.classList.add("border-default", "border-red-500");
                    inputIncomplete.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
                } else {
                    if (element.key.includes(".")) {
                        const splitKey = element.key.split(".");
                        splitKey.push("unity");
                        const finalKey = splitKey.join("_");
                        inputIncomplete = document.querySelector(`#${finalKey} input`);
                    } else {
                        const finalKey = element.key.concat("_unity");
                        inputIncomplete = document.querySelector(`#${finalKey} input`);
                    }
                    inputIncomplete.classList.add("border-default", "border-red-500");
                    inputIncomplete.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
                }
            }
        });
    }

    function unsetInputWarning(settingsArray) {
        settingsArray.forEach((element) => {
            let numberInputComplete = document.getElementById(element.key);
            let unityInputComplete;
            if (element.key.includes(".")) {
                const splitKey = element.key.split(".");
                splitKey.push("unity");
                const finalKey = splitKey.join("_");
                unityInputComplete = document.querySelector(`#${finalKey} input`);
            } else {
                const finalKey = element.key.concat("_unity");

                unityInputComplete = document.querySelector(`${finalKey} input`);
            }
            numberInputComplete.classList.remove("border-default", "border-red-500");
            numberInputComplete.classList.add("border-none");
            if (unityInputComplete) {
                unityInputComplete.classList.remove("border-default", "border-red-500");
            }
        });
    }

    useEffect(() => {
        if (tabFromPath === "bots") {
            if (!isEmpty(actualBot)) {
                getEntityConfig();
            }
            return;
        }
        if (tabFromPath === "company") {
            if (!isEmpty(company)) {
                getEntityConfig();
            }
            return;
        }
        if (tabFromPath === "teams") {
            if (!isEmpty(selectedTeam)) {
                getEntityConfig();
            }
            return;
        }
    }, [actualBot, tabFromPath, selectedTeam]);

    const loadBots = async () => {
        setLoadingBots(true);
        try {
            const params = {
                companyId,
                shouldPaginate: false,
            };
            const { payload } = await dispatch(getBots(params));
            setBots(payload);
            setLoadingBots(false);
        } catch (error) {
            setLoadingBots(false);
            console.log(error);
        }
    };

    useEffect(() => {
        loadBots();
    }, []);

    useEffect(() => {
        let allTabs = [
            { name: t("Bots"), tab: "bots", permission: "settings:view_bot_settings" },
            { name: t("settings.company"), tab: "company", permission: "settings:company_settings" },
            { name: t("AdminFilters.teams"), tab: "teams", permission: "settings:team_settings" },
            { name: t("schedule.title"), tab: "schedules", permission: "schedules:view_schedule" },
        ];

        const tabsWithPermission = allTabs.filter((tab) => settingsPermissionsList.find((permission) => permission === tab.permission));

        if (isEmpty(menuOptions)) {
            setMenuOptions(tabsWithPermission);
        }
    }, [menuOptions, t, lang]);

    const options = menuOptions.map((opt, index) => {
        return {
            id: index,
            name: opt.children ? opt.children.toLowerCase() : opt.tab.toLowerCase(),
            label: opt.children ? opt.children.toLowerCase() : opt.name.toLowerCase(),
            hidden: false,
            handleClick: () => {
                setCurrentOptionId(index);
                setTabs(opt.tab);
                navigate(`settings/${opt.tab}`);
            },
        };
    });

    const handleOnClickPremium = (feature) => {
        setOpenPremiumFeatureModal(true);
        setFeatureToUnlock(feature);
    };

    const switchTab = (tab) => {
        switch (toUpper(tab)) {
            case "SCHEDULES":
                return <SettingsSchedules permissionsList={permissionsList} />;
            case "BOTS":
                return (
                    <SettingsBots
                        disableUpdateCRM={disableUpdateCRM}
                        setDisableUpdateCRM={setDisableUpdateCRM}
                        showSavingWarning={showSavingWarning}
                        setShowSavingWarning={setShowSavingWarning}
                        notifyError={notifyError}
                        notify={notify}
                        handleOnClickPremium={handleOnClickPremium}
                        keysToRestore={keysToRestore}
                        setKeysToRestore={setKeysToRestore}
                        openRestoreConfigModal={openRestoreConfigModal}
                        setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                        restoreConfig={restoreConfig}
                        closeRestoreModal={closeRestoreModal}
                        noBodyData={noBodyData}
                        settingsValidation={settingsValidation}
                        setSettingsValidation={setSettingsValidation}
                        setSettingsSection={setSettingsSection}
                        settingsSection={settingsSection}
                        allowSectionChange={allowSectionChange}
                        setAllowSectionChange={setAllowSectionChange}
                        loadingUpdateEntity={loadingUpdateEntity}
                        handleSubmitConfig={handleSubmitConfig}
                        settingsBodyRef={settingsBodyRef}
                        settingsBody={settingsBody}
                        configSettingsBody={configSettingsBody}
                        loadingSettings={loadingSettings}
                        botId={botId}
                        setActualBot={setActualBot}
                        actualBot={actualBot}
                        allBotConfig={allBotConfig}
                        setAllBotConfig={setAllBotConfig}
                        getBotConfig={getEntityConfig}
                        loadingBots={loadingBots}
                        botsSearchResult={botsSearchResult}
                        bots={bots}
                        searchBotValue={searchBotValue}
                        handleCleanSearch={handleCleanSearch}
                        handleSearchBot={handleSearchBot}
                        t={t}
                    />
                );
            case "COMPANY":
                return (
                    <CompanySettings
                        settingsSection={settingsSection}
                        setSettingsSection={setSettingsSection}
                        loadingSettings={loadingSettings}
                        actualBot={actualBot}
                        setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                        setKeysToRestore={setKeysToRestore}
                        noBodyData={noBodyData}
                        loadingUpdateEntity={loadingUpdateEntity}
                        handleSubmitConfig={handleSubmitConfig}
                        settingsBodyRef={settingsBodyRef}
                        allBotConfig={allBotConfig}
                        settingsBody={settingsBody}
                        bots={bots}
                        configSettingsBody={configSettingsBody}
                        setActualBot={setActualBot}
                        handleCleanSearch={handleCleanSearch}
                        handleSearchBot={handleSearchBot}
                        searchBotValue={searchBotValue}
                        botsSearchResult={botsSearchResult}
                    />
                );
            case "TEAMS":
                return (
                    <TeamsSettings
                        monitorAllTeams={monitorAllTeams}
                        settingsSection={settingsSection}
                        setSettingsSection={setSettingsSection}
                        getBotConfig={getEntityConfig}
                        selectedTeam={selectedTeam}
                        setSelectedTeam={setSelectedTeam}
                        company={company}
                        loadingSettings={loadingSettings}
                        actualBot={actualBot}
                        setOpenRestoreConfigModal={setOpenRestoreConfigModal}
                        setKeysToRestore={setKeysToRestore}
                        noBodyData={noBodyData}
                        loadingUpdateEntity={loadingUpdateEntity}
                        handleSubmitConfig={handleSubmitConfig}
                        settingsBodyRef={settingsBodyRef}
                        allBotConfig={allBotConfig}
                        settingsBody={settingsBody}
                        bots={bots}
                        configSettingsBody={configSettingsBody}
                        setActualBot={setActualBot}
                        handleCleanSearch={handleCleanSearch}
                        handleSearchBot={handleSearchBot}
                        searchBotValue={searchBotValue}
                        botsSearchResult={botsSearchResult}
                    />
                );
        }
    };

    const handleSearchBot = ({ target }) => {
        const { value } = target;
        setSearchBotValue(value);
        const fuse = new Fuse(bots, {
            keys: ["name", "type"],
        });
        const result = fuse.search(value);
        const resultFiltered = result.map((result) => result.item);

        setBotsSearchResult(resultFiltered);
    };

    const handleCleanSearch = () => {
        setSearchBotValue("");
    };

    return (
        <div className="mx-8 pb-6 pt-2 ">
            <div className="px-4 pt-4">
                <Menu title={t("settingsMenu.title")} options={options} tabs={tabs} currentOptionId={currentOptionId} lang={lang} hasTabs={true} view={"settings"} />
            </div>
            <div className="mt-2 flex h-[84vh] px-4 pt-4">
                <div className="flex w-full rounded-r-1">{switchTab(tabFromPath)}</div>
            </div>
            {openPremiumFeatureModal && <PremiumFeaturesModal premiumFeature={featureToUnlock} setOpen={setOpenPremiumFeatureModal} />}
            {openRestoreConfigModal && <RestoreConfigModal t={t} onCancel={closeRestoreModal} onConfirm={restoreConfig} />}
            <ToastContainer />
        </div>
    );
}
export default SettingsIndex;
