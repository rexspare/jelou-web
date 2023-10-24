import { TRIGGER_VIEW } from '../constants';
import { useParams } from 'react-router-dom';
import { useState, useContext } from 'react';

import TriggersContext from '../TriggersContext';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { renderMessage } from '@apps/shared/common';
import CreateTriggerTitle from '../components/CreateTriggerTitle';
import TriggerFooterButtons from '../components/TriggerFooterButtons'
import CreateTriggersActions from '../components/CreateTriggersActions';

import { MESSAGE_TYPES } from '@apps/shared/constants';
import { createTrigger, updateTrigger } from '../services/Triggers';

const CreateTriggersView = ({ setTriggersView, parsedEvents, companyId, refetchWebhooks }) => {

    const { t } = useTranslation();
    const { databaseId } = useParams();
    const lang = useSelector((state) => state.userSession?.lang) ?? 'es';
    const { editedWebhook, setEditedWebhook } = useContext(TriggersContext);
    
    const isEditingMode = !!editedWebhook.id;

    const [isLoadingCreate, setLoadingCreate] = useState(false);
    const [isSomeComponentEditing, setIsSomeComponentEditing] = useState(!isEditingMode);

    const [triggerURL, setTriggerURL] = useState(editedWebhook.url ?? '');
    const [triggerTitle, setTriggerTitle] = useState(editedWebhook.name ?? '');
    const [triggerEvents, setTriggerEvents] = useState(editedWebhook.actions ?? [{}]);
    const [triggerActions, setTriggerActions] = useState([editedWebhook.type] ?? [{}]);
    const parsedEventsOptions = parsedEvents.filter((event) => !triggerEvents.includes(event.value));

    const disableSaveButton = triggerURL === '' || triggerTitle === '' || triggerEvents.length === 0 || triggerActions.length === 0 || isSomeComponentEditing;

    const handleCreateTrigger = async () => {
        try {
            setLoadingCreate(true);
            const webhook = {
                name: triggerTitle,
                entity: "DATUM",
                entityId: databaseId.toString(),
                url: triggerURL.trim(),
                type: triggerActions[0],
                subscriptions: triggerEvents,
            }
            const message = await createTrigger({ webhook, companyId, lang });
            resetState(message);
        } catch (error) {
            console.error("service ~ deleteTrigger ~ catch", { error });
            renderMessage(String(error), MESSAGE_TYPES.ERROR);
        }
        setLoadingCreate(false);
    }

    const handleEditTrigger = async () => {
        try {
            setLoadingCreate(true);
            const updatedWebhook = {
                name: triggerTitle,
                entity: editedWebhook.entity,
                entityId: editedWebhook.entityId,
                url: triggerURL.trim(),
                type: triggerActions[0],
                subscriptions: triggerEvents,
            }
            const message = await updateTrigger({ webhook : editedWebhook, companyId, updatedWebhook });
            resetState(message);
        } catch (error) {
            console.error("service ~ editTrigger ~ catch", { error });
            renderMessage(String(error), MESSAGE_TYPES.ERROR);
        }
        setLoadingCreate(false);
    }

    const resetState = (message) => {
        refetchWebhooks();
        setEditedWebhook({});
        setTriggersView(TRIGGER_VIEW.TRIGGERS);
        renderMessage(message, MESSAGE_TYPES.SUCCESS);
    }

    return (
        <div className='grid grid-rows-[max-content_1fr] w-full py-6 divide-y-1'>
            <CreateTriggerTitle
                triggerTitle={triggerTitle}
                setTriggerTitle={setTriggerTitle}
                setIsSomeComponentEditing={setIsSomeComponentEditing}
            />       
            <CreateTriggersActions 
                triggerURL={triggerURL}
                parsedEvents={parsedEvents}
                isEditingMode={isEditingMode}
                triggerEvents={triggerEvents}
                setTriggerURL={setTriggerURL}
                triggerActions={triggerActions}
                setTriggerEvents={setTriggerEvents}
                setTriggerActions={setTriggerActions}
                parsedEventsOptions={parsedEventsOptions}
                setIsSomeComponentEditing={setIsSomeComponentEditing}
            />
            <div className='grid items-end justify-end px-10'>
                <TriggerFooterButtons
                    loading={isLoadingCreate}
                    disableSaveButton={disableSaveButton}
                    submitTrigger={isEditingMode ? handleEditTrigger : handleCreateTrigger}
                    cancelTrigger={() => {
                        setEditedWebhook({});
                        setTriggersView(TRIGGER_VIEW.TRIGGERS)
                    }}
                    labelBtnPrincipal={isEditingMode ? t("datum.triggers.create.editTrigger") : t("datum.triggers.create.createTrigger")}
                />
            </div>
        </div>
    )
}

export default CreateTriggersView