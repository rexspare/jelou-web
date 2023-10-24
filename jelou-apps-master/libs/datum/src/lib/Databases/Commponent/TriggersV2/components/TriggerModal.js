import { useSelector } from "react-redux";
import { Modal } from "../../Modals/Index";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { 
    BackIcon, 
    CloseIcon2, 
    WebhookIcon, 
} from "@apps/shared/icons";
import { TRIGGER_VIEW } from "../constants";
import TriggersView from "../pages/TriggersView";
import NoTriggersView from "../pages/NoTriggersView";
import CreateTriggersView from "../pages/CreateTriggerView";
import { parseTriggerEvents } from "../utils/parseTriggerEvents";

import TriggersContext from "../TriggersContext";

const TriggerModal = ({
    webhooks,
    isShow = false,
    companyId = "",
    refetchWebhooks,
    webhookEvents = [],
    closeModal = () => null,
}) => {
    
    const { t } = useTranslation();
    const { databaseId } = useParams();
    const [editedWebhook, setEditedWebhook] = useState({});
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const filteredWebhooks = webhooks.filter((webhook) => webhook.entityId === databaseId);
    const [triggersView, setTriggersView] = useState(filteredWebhooks.length > 0 ? TRIGGER_VIEW.TRIGGERS: TRIGGER_VIEW.NO_TRIGGERS);

    const isHasTriggers = triggersView === TRIGGER_VIEW.TRIGGERS;
    const isNoTriggers = triggersView === TRIGGER_VIEW.NO_TRIGGERS;
    const isCreateTriggers = triggersView === TRIGGER_VIEW.CREATE_TRIGGER;

    useEffect(() => {
        if (filteredWebhooks.length === 0 && triggersView === TRIGGER_VIEW.TRIGGERS) {
            setTriggersView(TRIGGER_VIEW.NO_TRIGGERS);
        };
    },[webhooks]);

    return (
        <TriggersContext.Provider value={{editedWebhook, setEditedWebhook}}>
            <Modal isShow={isShow} widthModal="w-[62rem] h-[97vh]">
                <section className="relative inline-block h-full w-full transform overflow-hidden rounded-20 bg-white text-left font-bold text-gray-400 shadow-xl transition-all">
                    <header className="flex h-14 w-full items-center justify-between bg-primary-40 px-5 text-xl text-primary-200 lg:h-15 lg:px-8 lg:text-2xl">
                        <div className="flex gap-2 items-center justify-center">
                            {
                                isCreateTriggers && 
                                <div 
                                    onClick={() => {
                                        setEditedWebhook({});
                                        setTriggersView(filteredWebhooks.length > 0 ? TRIGGER_VIEW.TRIGGERS: TRIGGER_VIEW.NO_TRIGGERS)
                                    }}
                                >
                                    <BackIcon width="1.5rem" height="1.5rem" className="cursor-pointer" />
                                </div>
                            }
                            <div className="flex items-center space-x-3 px-3">
                                <WebhookIcon width="2rem" height="2rem" />
                                <span>{t("datum.triggers.title")}</span>
                            </div>
                        </div>
                        <button
                            className="w-12"
                            aria-label="Close"
                            onClick={(evt) => {
                                closeModal();
                                evt.preventDefault();
                            }}>
                            <CloseIcon2 
                                fillOpacity={1} 
                                fill={'#00B3C7'}
                                width={"1.3rem"} 
                                height={"1.3rem"} 
                            />
                        </button>
                    </header>
                    { 
                        isHasTriggers && 
                        <main className="flex h-[85vh]">
                            <TriggersView
                                webhooks={filteredWebhooks}
                                companyId={companyId}
                                refetchWebhooks={refetchWebhooks}
                                setTriggersView={setTriggersView}
                            />
                        </main>
                    }
                    {
                        isNoTriggers && 
                        <main className="flex h-[95vh] justify-center items-center">
                            <NoTriggersView 
                                setTriggersView={setTriggersView}
                            />
                        </main>
                    }
                    {
                        isCreateTriggers && 
                        <main className="flex h-[88vh]">
                            <CreateTriggersView
                                companyId={companyId}
                                refetchWebhooks={refetchWebhooks}
                                setTriggersView={setTriggersView}
                                parsedEvents={parseTriggerEvents(webhookEvents, lang)}
                            />
                        </main>
                    }
                </section>
            </Modal>
        </TriggersContext.Provider>
    )
}

export default TriggerModal