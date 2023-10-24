import { useState, useEffect } from 'react';
import { Input } from '@apps/shared/common';
import { EditIcon } from "@apps/shared/icons";
import { useTranslation } from 'react-i18next';
import { InputErrorMessage } from "./TriggerErrorMessage";

const CreateTriggerTitle = ({ triggerTitle, setTriggerTitle, setIsSomeComponentEditing }) => {

    const { t } = useTranslation();
    const [titleError, setTitleError] = useState(null);
    const [isEditTitle, setIsEditTitle] = useState(false);
    const [changedTitle, setChangedTitle] = useState(triggerTitle ?? '');
    const inputClassName = `inputWH h-38 w-30 flex-1 rounded-lg px-2 text-base lg:text-15 text-gray-400 outline-none ${titleError ? 'border-red-500 focus:border-red-800 bg-red-100' : 'border-transparent ring-transparent focus:border-transparent focus:ring-transparent bg-[#f3f8fe]'}`;
    const isTextSubtmited = triggerTitle && !isEditTitle;

    const handleTextSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        setIsEditTitle(false);
        setTriggerTitle(data.name);
        setIsSomeComponentEditing(false);
    }

    const handleEditTitle = () => {
        setIsEditTitle(true);
        setIsSomeComponentEditing(true);
    }

    useEffect(() => {
        if (changedTitle.length !== 0 && changedTitle.length < 3) {
            setTitleError(t("datum.triggers.validations.name.min"));
            return;
        }
        if (changedTitle.length > 50) {
            setTitleError(t("datum.triggers.validations.name.max"));
            return;
        }
        setTitleError(null);
    }, [changedTitle]);

    return (
        <div className='mb-4 px-10 h-14'>
            {
                isTextSubtmited &&
                <div className='flex gap-4 items-center mt-2'>
                    <p className='text-xl font-bold'>{triggerTitle}</p>
                    <div onClick={handleEditTitle} className="cursor-pointer">
                        <EditIcon width={18} height={18} fill="currentColor"/>
                    </div>
                </div>
            }
            {
                !isTextSubtmited &&
                <form onSubmit={handleTextSubmit} className='flex gap-8 w-full items-baseline'>
                    <p className='text-base w-[18rem]'>{t("datum.triggers.create.title")}</p>
                    <div className='flex flex-col w-[28rem]'>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            required={true}
                            autoFocus={true}
                            value={changedTitle}
                            className={inputClassName}
                            placeholder={t("datum.triggers.create.placeholder")}
                            onChange={(event) =>  setChangedTitle(event.target.value)}
                        />
                        {titleError && <InputErrorMessage hasError={titleError} />}
                    </div>
                    <button 
                        type="submit" 
                        disabled={titleError !== null || changedTitle.length === 0}
                        className="flex cursor-pointer items-center space-x-1 whitespace-nowrap rounded-3xl border-transparent bg-[#00B3C7] py-3 px-5 text-base text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t("buttons.save")}
                    </button>
                </form>
            }
        </div>
    )
}

export default CreateTriggerTitle