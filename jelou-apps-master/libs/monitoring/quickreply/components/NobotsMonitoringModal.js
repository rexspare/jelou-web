import React, { useRef } from "react";

import { useTranslation } from "react-i18next";

import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const NobotsMonitoringModal = (props) => {
    const { setOpen, modalRef } = props;

    const ref = useRef();
    const { t } = useTranslation();

    useOnClickOutside(ref, () => {
        return setOpen(false);
    });

    return (
        <div className="fixed inset-x-0 top-0 z-120 overflow-y-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className="w-[27rem] max-w-4xl justify-center" ref={modalRef}>
                <div className="relative z-50 m-auto flex max-h-content w-full flex-col items-center overflow-hidden rounded-3xl bg-white px-6 pt-8 opacity-100 shadow-modal">
                    <button onClick={() => setOpen(false)}>
                        <CloseIcon className="absolute top-2 right-2 fill-current text-gray-400" width="1rem" height="1rem" />
                    </button>

                    <div className="flex items-center pb-2">
                        <img src="assets/illustrations/botDefaultLogo.svg" alt="Bot Logo" className="h-32 w-32 " />
                    </div>
                    <p className="text-lg text-gray-400">
                        {" "}
                        <span className="font-bold">¡Oops!</span>,{t("monitoring.parece que no tienes bots para crear tus plantillas")} ,{" "}
                        <span className="font-bold">{t("monitoring.por favor comunícate con tu CSM")}</span>
                    </p>
                    <div className="flex w-full flex-col justify-end pt-6 pb-8 md:flex-row">
                        <div className="mt-6 mr-3 flex text-center md:mt-0">
                            <button
                                type="submit"
                                className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                                onClick={() => setOpen(false)}>
                                {t("common.close")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NobotsMonitoringModal;
