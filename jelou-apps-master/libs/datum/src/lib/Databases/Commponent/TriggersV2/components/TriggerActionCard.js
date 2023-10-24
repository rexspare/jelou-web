import { useEffect, useState } from "react"
import TriggerSelect from "./TriggerSelect"
import { TextArea } from "@apps/shared/common"
import { InputErrorMessage } from "./TriggerErrorMessage";

import { useTranslation } from 'react-i18next';
import { Menu , Transition} from '@headlessui/react';

import { 
    Dots, 
    EditIcon, 
} from "@apps/shared/icons";

const TriggerActionCard = ({
    options,
    triggerURL,
    placeholder,
    isEditingMode,
    triggerAction,
    setTriggerURL,
    setTriggerActions,
    setIsSomeComponentEditing
}) => {

    const { t } = useTranslation();
    const [errorURL, setErrorURL] = useState(false);
    const [controlledURL, setControlledURL] = useState(triggerURL);
    const [triggerCardValue, setTriggerCardValue] = useState(triggerAction);
    const [isCardSave, setIsCardSave] = useState(isEditingMode ? true : false);

    const handleCardSave = () => {
        setTriggerActions([triggerCardValue.value ?? triggerAction])
        setTriggerURL(controlledURL);
        setIsCardSave(true);
        setIsSomeComponentEditing(false);
    }

    const handleCardEdit = () => {
        setIsCardSave(false);
        setIsSomeComponentEditing(true);
    }

    useEffect(() => {
        if (!urlPatternValidation(controlledURL) && controlledURL) {
            setErrorURL(true);
        } else {
            setErrorURL(false);
        }
    },[controlledURL]);

    const urlPatternValidation = (URL) => {
        const regex = new RegExp("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?");
        return regex.test(URL);
    };

    return (
        <div className="flex w-full">
            <div className='p-4 border-solid border-2 border-[rgba(166, 180, 208, 0.60)] rounded-xl flex flex-col w-74'>
                <TriggerSelect 
                    isAction={true}
                    options={options}
                    name="action-select"
                    value={triggerAction}
                    disabled={isCardSave}
                    placeholder={placeholder}
                    onChange={(value) => {
                        setTriggerCardValue(value)
                    }}
                />
                {
                    (triggerCardValue?.value === 'http' || triggerAction === 'http') && (
                        <div className="flex flex-col w-full">
                            <TextArea
                                name="URL"
                                isTriggers={true}
                                disabled={isCardSave}
                                value={controlledURL ?? ''}
                                onChange={(e) => setControlledURL(e.target.value)}
                                placeholder={t("datum.triggers.create.urlPlaceholder")}
                                className={`inputWH mt-4 w-full flex-1 rounded-lg border-transparent px-2 text-base lg:text-15 text-gray-400 outline-none ring-transparent focus:border-transparent focus:ring-transparent ${errorURL ?' bg-red-100' : ' bg-[#f3f8fe]'}`}
                            />
                            {errorURL && <InputErrorMessage hasError={t("datum.triggers.validations.link.required")} />}
                        </div>
                    )
                }
                {
                    !isCardSave && (
                    <footer className="flex gap-4 mt-4 items-center justify-end">
                        <button 
                            onClick={handleCardSave}
                            disabled={!controlledURL || errorURL}
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
                                disabled={!isCardSave}
                                onClick={handleCardEdit}
                                className="flex gap-2 w-full px-4 py-2 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >   
                                <EditIcon width={15} height={15} fill="currentColor"/>
                                {t("shop.prices.editButton")}
                            </button>
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>   
        </div>
    )
}

export default TriggerActionCard