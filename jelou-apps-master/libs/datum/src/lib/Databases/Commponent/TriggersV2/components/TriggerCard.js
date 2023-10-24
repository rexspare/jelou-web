import debounce from 'lodash/debounce';
import { useState, useContext, Suspense } from 'react';

import ActionsMenu from './ActionsMenu';
import TriggerIcons from './TriggerIcons';
import TriggerSwitch from './TriggerSwitch';

import { TRIGGER_VIEW } from '../constants';
import TriggersContext from '../TriggersContext';
import { renderMessage } from '@apps/shared/common';
import TriggerActionsText from './TriggerActionsText';
import { MESSAGE_TYPES } from '@apps/shared/constants';
import DuplicateModalWebhook from './DuplicateModalWebhook';
import DeleteModalWebhook from '../../CreateDatabase/DeleteModalWebhook';
import { deleteTrigger, createTrigger, updateTrigger } from '../services/Triggers';

const TriggerCard = ({ webhook, setTriggersView, refetchWebhooks, companyId }) => {
    const { subscriptions, active } = webhook;
    const { setEditedWebhook } = useContext(TriggersContext);

    const [triggerChecked, setTriggerChecked] = useState(active);

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [loadingDuplicate, setLoadingDuplicate] = useState(false);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    const [changedTitle, setChangedTitle] = useState(webhook?.name);

    const handleDeleteTrigger = async () => {
        try {
            setLoadingDelete(true);
            const message = await deleteTrigger({ webhook, companyId });
            resetState(message);
        } catch (error) {
            console.error("service ~ deleteTrigger ~ catch", { error });
            renderMessage(String(error), MESSAGE_TYPES.ERROR);
        }
        setLoadingDelete(false)
        setShowDeleteModal(false);
    }

    const handleDuplicateTrigger = async () => {
        try {
            setLoadingDuplicate(true);
            const duplicatedWebhook = getDuplicatedWebhook();
            const message = await createTrigger({ webhook : duplicatedWebhook, companyId });
            resetState(message);
        } catch (error) {
            console.error("service ~ duplicateTrigger ~ catch", { error });
            renderMessage(String(error), MESSAGE_TYPES.ERROR);
        }
        setLoadingDuplicate(false)
        setShowDuplicateModal(false);
    }

    const handleSwitchTrigger = debounce( async () => {
        setTriggerChecked(!triggerChecked);
        const updatedWebhook = { active: !triggerChecked}
        try {
            const message = await updateTrigger({ webhook : webhook, companyId, updatedWebhook });
            renderMessage(message, MESSAGE_TYPES.SUCCESS);
            refetchWebhooks();
        } catch (error) {
            console.error("service ~ updateTrigger ~ catch", { error });
            renderMessage(String(error), MESSAGE_TYPES.ERROR);
        }
    }, 800);

    const handleEditTrigger = () => {
        setEditedWebhook(webhook);
        setTriggersView(TRIGGER_VIEW.CREATE_TRIGGER);
    }

    const resetState = (message) => {
        refetchWebhooks();
        renderMessage(message, MESSAGE_TYPES.SUCCESS);
        setTriggersView(TRIGGER_VIEW.TRIGGERS);
    }

    const getDuplicatedWebhook = () => {
        return {
            name: changedTitle,
            entity: webhook.entity,
            entityId: webhook.entityId,
            url: webhook.url,
            subscriptions: webhook.actions,
            active: webhook.active,
        }
    }

    return (
        <>
            <div className="h-70 w-[28rem] border-solid border-2 border-[rgba(166, 180, 208, 0.60)] rounded-xl grid grid-rows-[max-content] px-6 py-4 overflow-x-hidden">
                <div className='flex justify-between'>    
                    <TriggerIcons
                        subscriptions={subscriptions}
                    />
                    <ActionsMenu 
                        handleEditTrigger={handleEditTrigger}
                        handleDeleteTrigger={() => setShowDeleteModal(true)}
                        handleDuplicateTrigger={() => setShowDuplicateModal(true)}
                    />
                </div>
                <p className="text-xl font-bold text-left mt-4 cursor-pointer w-fit" onClick={handleEditTrigger}>
                    {webhook.name}
                </p>
                <TriggerActionsText
                    subscriptions={subscriptions}
                />
                <div className='grid items-end justify-end'>
                    <TriggerSwitch
                        triggerChecked={triggerChecked}
                        handleSwitchTrigger={handleSwitchTrigger}
                    />
                </div>
            </div>
            <Suspense>
                <DeleteModalWebhook
                    webhook={webhook}
                    isShow={showDeleteModal}
                    loadingDelete={loadingDelete}
                    deleteWebhook={handleDeleteTrigger}
                    closeModal={() => setShowDeleteModal(false)}
                />
            </Suspense>
            <Suspense>
                <DuplicateModalWebhook
                    webhook={webhook}
                    title={changedTitle}
                    isShow={showDuplicateModal}
                    setTitle={setChangedTitle}
                    loadingDuplicate={loadingDuplicate}
                    duplicateWebhook={handleDuplicateTrigger}
                    closeModal={() => setShowDuplicateModal(false)}
                />
            </Suspense>
        </>
    )
}

export default TriggerCard