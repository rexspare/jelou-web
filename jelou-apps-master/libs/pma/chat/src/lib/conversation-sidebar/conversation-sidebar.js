import get from "lodash/get";
import first from "lodash/first";
import isEqual from "lodash/isEqual";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ContainerDimensions from "react-container-dimensions";
import { useTranslation, withTranslation } from "react-i18next";

import Validator from "validatorjs";
import es from "validatorjs/src/lang/es";

import Shop from "../shop/shop";
import Notes from "../notes/notes";
import { useParams } from "react-router-dom";
import "tippy.js/dist/tippy.css"; // optional
import CRMTab from "../sidebar-components/CRMTab";
import Tabs from "../sidebar-components/SidebarTabs";
import Profile from "../sidebar-components/ProfileTab";
import { TABS, tabsList } from "@apps/shared/constants";
import AISidebar from "../AI_sidebar";

const ConversationSidebar = ({ children, ...props }) => {
    const {
        storeParams,
        setStoreParams,
        savedData,
        setSavedData,
        sendCustomText,
        showButton,
        isArchivedRoom = false,
        hasPlugin = false,
        sidebarChanged,
        setSidebarChanged,
        setStatus,
        settings,
        hasSidebarSettingsEnabled,
        company,
        currentRoom,
    } = props;
    const { t } = useTranslation();

    // Translate validator messages
    Validator.register(
        "text",
        (value, requirement) => {
            //validate if is string
            return typeof value === "string";
        },
        t(`validator.El campo debe ser texto`)
    );

    Validator.register(
        "minDigits",
        (value, requirement) => {
            return value.length >= requirement;
        },
        `${t("validator.El campo")} :attribute ${t("validator.debe tener al menos")} :minDigits ${t("validator.caracteres")}.`
    );
    Validator.register(
        "maxDigits",
        (value, requirement) => {
            return value.length <= requirement;
        },
        `${t("validator.El campo")} :attribute ${t("validator.debe tener máximo")} :maxDigits ${t("validator.caracteres")}`
    );

    const [errorArray, setErrorArray] = useState([]);
    const [settingsArray, setSettingsArray] = useState([]);
    const [tabs, setTabs] = useState(tabsList);
    const [tabSelected, setTabSelected] = useState(TABS.CRM);
    const [verifyStatus, setVerifyStatus] = useState(false);
    const showSidebar = useSelector((state) => state.showSidebar);
    const userSession = useSelector((state) => state.userSession);
    const { section } = useParams();
    const activeButton = !sidebarChanged && verifyStatus;
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    useEffect(() => {
        getVerify(settings);
        setSidebarChanged(storeParamsChanged());
    }, [storeParams]);

    useEffect(() => {
        getSettings();
    }, [currentRoom]);

    Validator.useLang(lang);

    useEffect(() => {
        const showShopSection = get(company, "properties.operatorView.showShopSection", true);
        const hasShopCredentials = Boolean(company.properties?.shopCredentials);
        let allTabs = addTab({ tabs: tabsList, hasShopCredentials, showShopSection });

        allTabs = validateCRMTab({ tabs: allTabs, hasSidebarSettingsEnabled });
        setTabs(allTabs);
    }, [company, section]);

    /**
     * This will veritfy if all params are correctly filled
     *
     */
    const getVerify = (settings) => {
        let rulesArray = {};
        let dataArray = {};

        let errorArray = {};
        let dataErrorArray = {};

        let dependantArray = [];
        settings &&
            settings.length > 0 &&
            settings.forEach((setting) => {
                const isObligatory = get(setting, "rules.isObligatory", false);
                const isDependent = get(setting, "rules.isDependent", false);
                if (isObligatory) {
                    if (!storeParams[setting.name]) {
                        setStatus(false);
                        setVerifyStatus(false);
                    }
                    if (get(setting, "rules.rules")) {
                        rulesArray = { ...rulesArray, [setting.name]: get(setting, "rules.rules", "required") };
                        dataArray = { ...dataArray, [setting.name]: storeParams[setting.name] };
                    }
                }
                if (get(setting, "rules.rules")) {
                    errorArray = { ...errorArray, [setting.name]: get(setting, "rules.rules", "required") };
                    dataErrorArray = { ...dataErrorArray, [setting.name]: storeParams[setting.name] };
                }
                if (isDependent) {
                    dependantArray.push(setting.name);
                }
            });
        let validation = new Validator(dataArray, rulesArray, { required_if: "Campo requerido" });

        const veredict = validation.passes();

        Validator.setMessages("es", es);
        let errVal = new Validator(dataErrorArray, errorArray, { required_if: "Campo requerido" });
        errVal.fails();
        setErrorArray(errVal.errors.errors);
        const errors = errVal.errors.errors;
        const dependantVeredict = !getDependantError(errors, dependantArray);

        setStatus(veredict * dependantVeredict);
        setVerifyStatus(veredict * dependantVeredict);

        return false;
    };

    const getDependantError = (errorArray, dependantArray) => {
        const objKeys = Object.keys(errorArray);
        let value = false;
        dependantArray.forEach((dependant) => {
            const finder = objKeys.find((error) => error === dependant);
            if (finder) {
                value = true;
                return;
            }
        });
        return value;
    };

    const storeParamsChanged = () => {
        return isEqual(savedData, storeParams);
    };

    /**
    This function gets all the settings that are not textbox for the new design
    */
    const getSettings = () => {
        let arraySettings = [];
        settings.map((setting) => {
            arraySettings.push(setting);
            return setSettingsArray(arraySettings);
        });
    };

    const validateCRMTab = ({ tabs, hasSidebarSettingsEnabled = false }) => {
        if (!hasSidebarSettingsEnabled && !hasPlugin) {
            const filterCRMTab = tabs.filter(({ name }) => name !== TABS.CRM);
            const firstTab = first(filterCRMTab);
            setTabSelected(firstTab.name);
            const newTabs = tabs.filter(({ name }) => name !== TABS.CRM);
            return newTabs;
        }
        return tabs;
    };

    const addTab = ({ tabs = [], showShopSection, hasShopCredentials } = {}) => {
        if (showShopSection === false || isArchivedRoom) return tabs;

        const catalougeTab = {
            name: TABS.CATALOGUE,
            label: "Catálogo",
            disable: !hasShopCredentials,
            messageDisable: t("pma.Parece que no tienes acceso a esta sección"),
        };
        const _tabs = [...tabs, catalougeTab];
        return _tabs;
    };

    const sidebarRender = {
        [TABS.PROFILE]: () => <Profile currentRoom={currentRoom} />,
        [TABS.CATALOGUE]: () => <Shop sendCustomText={sendCustomText} />,
        [TABS.AI]: () => <AISidebar />,
        [TABS.NOTES]: () => <Notes currentRoom={currentRoom} />,
        [TABS.CRM]: ({ heightOfParent }) =>
            hasPlugin ? (
                <div className="flex overflow-y-scroll">{children}</div>
            ) : (
                hasSidebarSettingsEnabled && (
                    <CRMTab
                        heightOfParent={heightOfParent}
                        isArchivedRoom={isArchivedRoom}
                        showButton={showButton}
                        activeButton={activeButton}
                        errorArray={errorArray}
                        setSavedData={setSavedData}
                        setSidebarChanged={setSidebarChanged}
                        setStoreParams={setStoreParams}
                        settings={settings}
                        settingsArray={settingsArray}
                        storeParams={storeParams}
                        userSession={userSession}
                    />
                )
            ),
    };

    return (
        showSidebar && (
            <div className="flex">
                <ContainerDimensions>
                    {({ height }) => {
                        const heightOfParent = isArchivedRoom ? height - 100 : height - 220;
                        return (
                            <section className="border-lft hidden max-w-xs flex-col rounded-r-xl bg-white mid:relative mid:flex mid:w-72 lg:w-78">
                                <div className="grid h-full" style={{ gridTemplateRows: "auto 1fr" }}>
                                    <Tabs tabsList={tabs} setTabSelected={setTabSelected} tabSelected={tabSelected} />
                                    {sidebarRender[tabSelected]({ heightOfParent })}
                                </div>
                            </section>
                        );
                    }}
                </ContainerDimensions>
            </div>
        )
    );
};

export default withTranslation()(ConversationSidebar);
