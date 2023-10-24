import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DashboardServer } from "@apps/shared/modules";
import SettingsHeader from "./SettingsHeader";
import Messages from "./Categories/BotAlerts/Messages";
import { SimpleRowSkeleton } from "@apps/shared/common";
import GeneralSettings from "./Categories/Generales/GeneralSettings";
import MesaDeAyudaSettings from "./Categories/MesaDeAyuda/MesaDeAyudaSettings";

const Settings = () => {
    const params = useParams();
    const bot = params.botId;
    const [botData, setBotData] = useState({});
    const [loading, setLoading] = useState(false);
    const [botHeader, setBotHeader] = useState({});
    const [activeCategory, setActiveCategory] = useState();
    const [categoriesList, setCategoriesList] = useState([]);
    const company = useSelector((state) => state.company);
    let loadingSkeleton = [];
    const { t } = useTranslation();

    const handleCategory = (cat) => {
        loadBotInfo();
        setActiveCategory(cat);
    };

    useEffect(() => {
        setLoading(true);
        loadCategories();
        handleCategory(1);
        // setOpenFormGeneral(true);
    }, []);

    const loadBotInfo = async () => {
        const companyId = company.id;
        try {
            const resp = await DashboardServer.get(`companies/${companyId}/bots/${bot}`);
            const { data } = resp;
            const botProps = data.data.properties;
            setBotData({ ...botProps });
            setBotHeader({
                id: data.data.id,
                name: data.data.name,
                type: data.data.type,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const loadCategories = async () => {
        setCategoriesList([
            { id: 1, name: t("botsSettings.general") },
            { id: 2, name: t("botsSettings.panelMulti") },
            { id: 3, name: "Mensajes" },
        ]);
        setLoading(false);
    };

    for (let i = 0; i < 6; i++) {
        loadingSkeleton.push(<SimpleRowSkeleton key={i} />);
    }

    return (
        <div className="bg-app-body ml-18 flex min-h-screen w-full flex-1 flex-col">
            <SettingsHeader bot={botHeader} />
            <div className="flex flex-1 overflow-hidden rounded-lg p-12">
                <div className="flex w-full flex-1 overflow-hidden rounded-lg">
                    <div className="xs:w-full md:min-w-74.96 relative">
                        <div className="mr-6 h-users overflow-auto">
                            {loading ? (
                                <div className="relative overflow-auto pb-4">{loadingSkeleton}</div>
                            ) : !isEmpty(categoriesList) ? (
                                <div className="relative">
                                    {categoriesList.map((cat, key) => (
                                        <div key={key} onClick={() => handleCategory(cat.id)}>
                                            <div
                                                className={`mb-4 inline-flex w-full cursor-pointer items-center rounded-lg border-2 bg-white px-5 py-4 align-middle transition ${
                                                    activeCategory && activeCategory.id === cat.id ? "border-2 border-primary-200" : "border-gray-45"
                                                }`}>
                                                <div className="relative w-full pl-1">
                                                    <dd className="w-full text-15 font-bold text-gray-400">{cat.name}</dd>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div />
                            )}
                        </div>
                    </div>
                    {!isEmpty(botData) && (
                        <>
                            {activeCategory === 1 && (
                                <div className="flex w-full overflow-hidden rounded-lg border-1 border-gray-45 bg-white">
                                    <GeneralSettings bot={botData} botHeader={botHeader} loadBotInfo={loadBotInfo} company={company} />
                                </div>
                            )}
                            {activeCategory === 2 && (
                                <div className="flex w-full overflow-hidden rounded-lg border-1 border-gray-45 bg-white">
                                    <MesaDeAyudaSettings bot={botData} botHeader={botHeader} loadBotInfo={loadBotInfo} />
                                </div>
                            )}

                            {activeCategory === 3 && (
                                <div className="flex w-full overflow-hidden rounded-lg border-1 border-gray-45 bg-white">
                                    <Messages bot={botData} botHeader={botHeader} loadBotInfo={loadBotInfo} company={company} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
