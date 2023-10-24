import { BeatLoader } from "react-spinners";
import React, { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { CloseIcon, JelouLogoIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const ActionsModal = (props) => {
    const { setOpen, onConfirm, action, isLoading } = props;
    const ref = useRef();
    const { t } = useTranslation();

    useOnClickOutside(ref, () => setOpen(false));

    const onClose = () => {
        setOpen(false);
    };

    const escFunction = (event) => {
        if (event.keyCode === 27) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    return (
        <div className="fixed inset-x-0 top-0 z-120 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className="min-w-125 transform rounded-lg bg-white px-6 pt-5 pb-4 shadow-modal transition-all" ref={ref}>
                <div className="mb-3 flex items-center justify-between pb-4">
                    <div className="flex items-center">
                        <div className={`bg-primary mr-2 flex items-center justify-center rounded-full md:mr-4`}>
                            <JelouLogoIcon width="1.875rem" height="2.5rem" />
                        </div>
                        <div className="max-w-md text-xl font-bold text-gray-400">
                            {action === "cancel" && t("scheduleModalLabel.cancelTittle")}
                            {action === "delete" && t("scheduleModalLabel.deleteTittle")}
                            {action === "deleteLastDetail" && t("scheduleModalLabel.deleteTittle")}
                        </div>
                    </div>
                    <span onClick={onClose}>
                        <CloseIcon className="cursor-pointer fill-current text-gray-400" width="1rem" height="1rem" />
                    </span>
                </div>
                <div className="relative">
                    <div>
                        <div className="mx-auto w-full max-w-sm pb-5">
                            <div className="mt-2">
                                <div className="mb-4">
                                    <div className="text-center text-lg text-gray-400 text-opacity-75">{t(`scheduleModalLabel.${action}`)}</div>
                                </div>

                                <div className="flex w-full flex-col justify-center pt-5 md:flex-row">
                                    <div className="mt-6 mr-3 flex text-center md:mt-0">
                                        <button
                                            type="submit"
                                            className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                                            onClick={onClose}>
                                            {t("scheduleModalLabel.no")}
                                        </button>
                                    </div>
                                    <div className="mt-6 flex text-center md:mt-0">
                                        <button type="submit" className="button-primary w-32" onClick={onConfirm}>
                                            {isLoading ? <BeatLoader color={"white"} size={"0.625rem"} /> : t("scheduleModalLabel.yes")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionsModal;
