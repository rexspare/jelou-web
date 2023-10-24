import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TRIGGER_ACTIONS } from "../constants";
import TriggerEventCard from "./TriggerEventCard";
import TriggerActionCard from "./TriggerActionCard";
import { NextTriggerIcon } from "@apps/shared/icons";
import { parseTriggerActions } from "../utils/parseTriggerActions";

const CreateTriggersActions = ({
    triggerURL,
    parsedEvents,
    triggerEvents,
    isEditingMode, 
    setTriggerURL,
    triggerActions, 
    setTriggerEvents,
    setTriggerActions, 
    parsedEventsOptions,
    setIsSomeComponentEditing
}) => {

    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const [isSomeEditing, setIsSomeEditing] = useState(isEditingMode ? [] : [triggerEvents[0]]);
    const noEvents = (triggerEvents.length === 0 || !triggerEvents.some(x => Number.isInteger(x)));
    const noActions = (triggerActions.length === 0 || !triggerActions.some(x => typeof x === 'string'));

    return (
        <>
            <div className='grid grid-cols-2 divide-x-1 overflow-y-scroll'>
                <div className="flex flex-col px-10">
                    <p className='text-lg font-bold text-[#00B3C7] mt-4'>{t("datum.triggers.create.when")}</p>
                    <p className='text-base'>{t("datum.triggers.create.happens")}</p>
                    <div className="flex flex-col gap-2 mt-2">
                        {
                            triggerEvents.map((triggerEvent, index) => (
                                <TriggerEventCard
                                    key={index}
                                    parsedEvents={parsedEvents}
                                    triggerEvent={triggerEvent}
                                    options={parsedEventsOptions}
                                    isEditingMode={isEditingMode}
                                    triggerEvents={triggerEvents}
                                    isSomeEditing={isSomeEditing}
                                    setIsSomeEditing={setIsSomeEditing}
                                    setTriggerEvents={setTriggerEvents}
                                    setIsSomeComponentEditing={setIsSomeComponentEditing}
                                    placeholder={t("datum.triggers.create.eventPlaceholder")}
                                />
                            ))
                        }
                    </div>
                    {
                        ((triggerEvents.length < 6 && isSomeEditing.length === 0) || triggerEvents.length === 0 ) && (
                            <button 
                                onClick={() => { 
                                    setIsSomeEditing([...isSomeEditing, {}]);
                                    setTriggerEvents([...triggerEvents, {}]);
                                    setIsSomeComponentEditing(true);
                                }}
                                className="self-start font-bold text-[#00B3C7] my-4"
                            >
                               {t("datum.triggers.create.addEvent")}
                            </button>
                        )
                    }
                </div>
                <div className='w-10 h-10 rounded-full bg-[#E6F7F9] absolute border-transparent flex justify-center items-center top-[50%] left-[50%] -translate-x-[55%]'>
                    <NextTriggerIcon fill="#00B3C7"/>
                </div>
                <div className='flex flex-col px-10'>
                    <p className='text-lg font-bold text-[#00B3C7] mt-4'>{t("datum.triggers.create.then")}</p>
                    <p className='text-base'>{t("datum.triggers.create.action")}</p>
                    <div className="flex flex-col gap-2 mt-2">
                        {
                            triggerActions.map((triggerAction, index) => (
                                <TriggerActionCard
                                    key={index}
                                    triggerURL={triggerURL}
                                    triggerAction={triggerAction}
                                    isEditingMode={isEditingMode}
                                    setTriggerURL={setTriggerURL}
                                    setTriggerActions={setTriggerActions}
                                    options={parseTriggerActions(TRIGGER_ACTIONS, lang)}
                                    setIsSomeComponentEditing={setIsSomeComponentEditing}
                                    placeholder={t("datum.triggers.create.actionPlaceholder")}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='flex gap-4 justify-center items-center py-8'>
                <p className='text-base w-[14.1rem] ml-[2.15rem]'>
                    {t("datum.triggers.create.when")}
                    {
                        triggerEvents.some(x => Number.isInteger(x)) &&
                        triggerEvents.filter(x => Number.isInteger(x)).map((x, index) => {
                            const event = parsedEvents.find(y => y.value === x)
                            return <span className='font-bold' key={event.value}>
                                {' ' + event.label.toLowerCase()}
                                {index === triggerEvents.length - 2 && t("datum.triggers.card.text.and")}
                                {index !== triggerEvents.length - 1 && index !== triggerEvents.length - 2  && ','}
                            </span>
                        })
                    }
                    {
                        noEvents &&
                        <span className="text-[#B8BDC9] font-bold">
                            {t("datum.triggers.create.noEvent")}
                        </span>
                    }
                </p>
                <div className='px-4'>
                    <NextTriggerIcon/>
                </div>
                <p className='text-base w-[16.5rem]'>
                    {t("datum.triggers.create.then")}
                    {
                        triggerActions.some(x => typeof x === 'string') &&
                        triggerActions.filter(x => typeof x === 'string').map((x) => {
                            const action = TRIGGER_ACTIONS.find(y => y.value === x);
                            return <span className='font-bold' key={action.value}>
                                {' ' + action.label[lang]}
                            </span>
                        })
                    }
                    {
                        noActions &&
                        <span className="text-[#B8BDC9] font-bold">
                            {t("datum.triggers.create.noAction")}
                        </span>
                    }
                </p>
            </div>
        </>
    )
}

export default CreateTriggersActions