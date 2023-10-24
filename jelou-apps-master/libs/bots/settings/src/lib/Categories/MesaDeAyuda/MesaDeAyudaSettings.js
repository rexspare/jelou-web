import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Reglas from "./Tabs/Reglas";
import Alertas from "./Tabs/Alertas";
import Generales from "./Tabs/Generales";
import SidebarSettings from "../Sidebar/SidebarSettings";

const MesaDeAyudaSettings = (props) => {
    const { bot, botHeader, loadBotInfo } = props;
    const [tab, setTab] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        setTab("generales");
    }, []);

    const handleTab = (e) => {
        e.preventDefault();
        setTab(e.target.id);
    };

    return (
        <div className="relative flex-1">
            <div className="inline-flex h-15 w-full items-center justify-between border-b-1 border-gray-45 px-10 py-5">
                <div className="inline-flex items-center align-middle">
                    <dd className="text-2xl font-medium leading-9 text-gray-400">{t("botsSettingsCategoriesDeskhelpSettings.multiagentPanel")}</dd>
                </div>
            </div>
            <div className="w-full items-center border-b-1 border-gray-45 px-10">
                <div className="inline-flex justify-between">
                    <div
                        id="generales"
                        className={`nowrap ${
                            tab === "generales" ? "border-b-5 border-primary-200" : ""
                        } mr-10 w-full cursor-pointer py-5 text-center  text-15 font-bold text-gray-400`}
                        onClick={handleTab}>
                        {t("botsSettingsCategoriesDeskhelpSettings.general")}
                    </div>
                    <div
                        id="alertas"
                        className={`nowrap ${
                            tab === "alertas" ? "border-b-5 border-primary-200" : ""
                        } mr-10 w-full cursor-pointer py-5 text-center  text-15 font-bold text-gray-400`}
                        onClick={handleTab}>
                        {t("botsSettingsCategoriesDeskhelpSettings.alerts")}
                    </div>
                    <div
                        id="sidebar"
                        className={`nowrap ${
                            tab === "sidebar" ? "border-b-5 border-primary-200" : ""
                        } mr-10 w-full cursor-pointer py-5 text-center  text-15 font-bold text-gray-400`}
                        onClick={handleTab}>
                        {t("botsSettingsCategoriesDeskhelpSettings.sidebar")}
                    </div>
                    <div
                        id="reglas"
                        className={`nowrap ${
                            tab === "reglas" ? "border-b-5 border-primary-200" : ""
                        } mr-10 w-full cursor-pointer py-5 text-center  text-15 font-bold text-gray-400`}
                        onClick={handleTab}>
                        {t("botsSettingsCategoriesDeskhelpSettings.rules")}
                    </div>
                </div>
            </div>
            <div>{tab === "generales" && <Generales bot={bot} botHeader={botHeader} loadBotInfo={loadBotInfo} />}</div>
            <div>{tab === "alertas" && <Alertas bot={bot} botHeader={botHeader} loadBotInfo={loadBotInfo} />}</div>
            <div>
                {tab === "sidebar" && (
                    <div className="p-10">
                        <SidebarSettings bot={bot} botHeader={botHeader} type="bot" loadBotInfo={loadBotInfo} />
                    </div>
                )}
            </div>
            <div>{tab === "reglas" && <Reglas bot={bot} botHeader={botHeader} loadBotInfo={loadBotInfo} />}</div>
        </div>
    );
};

export default MesaDeAyudaSettings;
