import { useState, useEffect } from "react"
import TriggerSelect from "./TriggerSelect"

import { useTranslation } from 'react-i18next';
import { Menu , Transition} from '@headlessui/react';

import { 
    Dots, 
    EditIcon, 
    TrashIcon, 
} from "@apps/shared/icons";

const TriggerEventCard = ({
    options,
    placeholder, 
    parsedEvents,
    triggerEvent,
    isEditingMode,
    triggerEvents, 
    isSomeEditing,
    setIsSomeEditing,
    setTriggerEvents, 
    setIsSomeComponentEditing
}) => {

    const { t } = useTranslation();
    const [isCardEdit, setIsCardEdit] = useState(false);
    const [triggerCardValue, setTriggerCardValue] = useState(triggerEvent);
    const [isCardSave, setIsCardSave] = useState(isEditingMode && Number.isInteger(triggerEvent) ? true : false);

    const handleCardSave = () => {
        setIsCardSave(true);
        setIsCardEdit(false);
        setIsSomeEditing([]);
        setIsSomeComponentEditing(false);
        setTriggerEvents(triggerEvents.map(x => x === triggerEvent ? triggerCardValue.value : x));
    }

    const handleCardEdit = () => {
        setIsCardSave(false);
        setIsCardEdit(true);
        setIsSomeEditing([...isSomeEditing, triggerEvent]);
        setIsSomeComponentEditing(true);
    }

    const handleCardCancel = () => {
        if (Number.isInteger(triggerEvent)) {
            setTriggerCardValue(triggerEvent);
        } else {
            setTriggerEvents(triggerEvents.filter(x => Number.isInteger(x)));
        }
        setIsCardSave(true);
        setIsCardEdit(false);
        setIsSomeEditing([]);
        setIsSomeComponentEditing(false);
    }

    const handleCardDelete = () => {
        setTriggerEvents(triggerEvents.filter(x => x !== triggerCardValue));
    }

    useEffect(() => {
        setTriggerCardValue(triggerEvent);
    }, [triggerEvent]);
    
    return (
        <div className="flex w-full">
            <div className='p-4 border-solid border-2 border-[rgba(166, 180, 208, 0.60)] rounded-xl flex flex-col w-74'>
                <TriggerSelect 
                    options={options}
                    name="event-select"
                    disabled={isCardSave}
                    value={triggerCardValue}
                    placeholder={placeholder}
                    parsedEvents={parsedEvents}
                    onChange={(value) => {
                        setTriggerCardValue(value)
                    }}
                />
                {
                    !isCardSave && (
                    <footer className="flex gap-4 mt-4 items-center justify-end">
                        <button
                            type="button"
                            onClick={handleCardCancel}
                            className="px-5 py-3 text-base font-bold text-gray-400 border-transparent outline-none rounded-3xl bg-gray-10"
                        >
                            {t("buttons.cancel")}
                        </button>
                        <button 
                            onClick={handleCardSave}
                            disabled={!Number.isInteger(triggerCardValue?.value)}
                            className="flex items-center px-3 py-3 space-x-2 text-base font-bold border-transparent outline-none whitespace-nowrap rounded-20 bg-primary-40 text-primary-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {t("buttons.save")}
                        </button>
                    </footer>
                    )
                }
            </div>
            <Menu as="div" className="">
                <Menu.Button as="button" className="h-9 w-7">
                    <div className="rotate-90">
                        <Dots width={25} height={25} className="" fill={'rgba(166, 180, 208, 0.60)'} />
                    </div>
                </Menu.Button>
                <Transition
                    as="section"
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items as="ul" className="absolute mr-6 right-0 z-120 w-36 overflow-hidden rounded-10 bg-white shadow-menu bottom-[25%] translate-y-[60%]">
                        <Menu.Item as="li">
                            <button
                                disabled={!isCardSave || isSomeEditing.length !== 0}
                                onClick={handleCardEdit}
                                className="flex gap-2 w-full px-4 py-2 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >   
                                <EditIcon width={15} height={15} fill="currentColor"/>
                                {t("shop.prices.editButton")}
                            </button>
                        </Menu.Item>
                        <Menu.Item as="li">
                            <button
                                disabled={isCardEdit || isSomeEditing.length !== 0}
                                onClick={handleCardDelete}
                                className="flex gap-2 w-full px-4 py-2 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" 
                            >
                                <TrashIcon width={15} height={15} fill="currentColor"/>
                                {t("shop.prices.deleteButton")}
                            </button>
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>   
        </div>
    )
}

export default TriggerEventCard