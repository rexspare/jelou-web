import { ClipLoader } from "react-spinners";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Modal } from "../../Modals/Index";
import { Input } from '@apps/shared/common';

import { InputErrorMessage } from "./TriggerErrorMessage";
import { CloseIcon2, DuplicateIcon } from "@apps/shared/icons";

const DuplicateModalWebhook = ({ 
    title, 
    webhook, 
    setTitle,
    isShow = false, 
    loadingDuplicate, 
    closeModal = () => null, 
    duplicateWebhook = () => null, 
} = {}) => {

    const { t } = useTranslation();
    const [titleError, setTitleError] = useState(null);

    const inputClassName = `inputWH h-38 w-30 flex-1 rounded-lg px-2 text-base lg:text-15 text-gray-400 outline-none ${titleError ? 'border-red-500 focus:border-red-800 bg-red-100' : 'border-transparent ring-transparent focus:border-transparent focus:ring-transparent bg-[#f3f8fe]'}`;

    useEffect(() => {
        if (title.length < 3 && title.length > 0) {
            setTitleError(t("datum.triggers.validations.name.min"));
            return;
        }
        if (title.length > 50) {
            setTitleError(t("datum.triggers.validations.name.max"));
            return;
        }
        setTitleError(null);
    }, [title])    

    return (
        <Modal closeModal={closeModal} isShow={isShow} widthModal="w-[50vh]">
            <section className="relative inline-block h-full w-full transform overflow-hidden rounded-20 bg-white text-left font-bold text-gray-400 shadow-xl transition-all">
                <header className="flex h-12 w-full items-center justify-between bg-primary-40 px-3 text-lg text-primary-200 lg:h-14 lg:px-5 lg:text-xl">
                    <div className="flex items-center space-x-3 px-3">
                        <DuplicateIcon width={15} height={15} fill={"#00B3C7"} />
                        <span className="text-primary-200">{t("datum.triggers.duplicateModal.title")}</span>
                    </div>
                    <button
                        aria-label="Close"
                        className="w-12"
                        onClick={(evt) => {
                            closeModal();
                            evt.preventDefault();
                        }}>
                        <CloseIcon2 />
                    </button>
                </header>
                <main className="flex h-auto flex-col space-y-4 p-4 lg:p-8">
                    <div className="flex flex-col space-y-3 font-normal text-gray-400">
                        <span className="text-base font-bold text-primary-200 lg:text-xl">{t("datum.triggers.duplicateModal.action")}</span>
                        <span>{t("datum.triggers.duplicateModal.subtitle")}</span>
                        <span className="self-center font-semibold italic underline text-clip w-fit">{webhook?.url}</span>
                        <span className="font-bold">{t("datum.triggers.duplicateModal.nameText")}</span>
                        <div className="flex flex-col">
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={title}
                                required={true}
                                autoFocus={true}
                                className={inputClassName}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t("datum.triggers.duplicateModal.inputPlaceholder")}
                            />
                            {titleError && <InputErrorMessage hasError={titleError} />}
                        </div>
                        <span className="text-sm font-semibold lg:text-lg">{t("datum.Desear hacerlo")}</span>
                    </div>
                    <button
                        className={`w-[11rem] self-center rounded-full bg-[#00B3C7] py-3 text-13 text-white lg:w-64 lg:text-base disabled:cursor-not-allowed disabled:opacity-50 ${
                            loadingDuplicate ? "cursor-not-allowed bg-opacity-50" : ""
                        }`}
                        disabled={loadingDuplicate || titleError}
                        onClick={() => duplicateWebhook(webhook)}>
                        {loadingDuplicate ? <ClipLoader size={"1.25rem"} color="white" /> : t("datum.triggers.duplicateModal.confirmation")}
                    </button>
                </main>
            </section>
        </Modal>
    )
}

export default DuplicateModalWebhook