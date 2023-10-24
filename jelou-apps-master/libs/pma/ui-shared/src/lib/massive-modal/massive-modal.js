import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import { useOnClickOutside } from "@apps/shared/hooks";
import NewFormModal from "../new-form-modal/new-form-modal";

const MassiveModal = (props) => {
    const { type = false, number, close, confirm } = props;
    const { t } = useTranslation();
    const ref = useRef();
    useOnClickOutside(ref, close);

    const handler = (e) => {
        if (e.keyCode === 27) {
            close();
        }
    };

    useEffect(() => {
        document.addEventListener("keyup", handler);
        return () => {
            document.removeEventListener("keyup", handler);
        };
    }, []);

    const label = get(type, "label", "");

    return (
        <NewFormModal onClose={close}>
            <div
                className={`relative max-w-sm transform overflow-y-auto rounded-[1.375rem] bg-white px-4 pt-5 pb-4 shadow-modal transition-all sm:p-8`}
                ref={ref}>
                <div className="flex flex-col items-center space-y-3">
                    <div className="flex items-center">
                        <div className="sm:max-w-56 md:max-w-128 whitespace-pre-line text-xl font-bold leading-snug text-primary-200 md:text-xl">
                            {number
                                ? t(`Estás apunto de ${label} ${number} ${number > 1 ? "emails" : "email"}`)
                                : `Estás a punto de ${label} este email`}
                        </div>
                    </div>
                    <button className="absolute right-0 top-0 mr-4 mt-4" onClick={() => close()}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.744913 12.7865L3.2609 15.3025L8.02135 10.5421L12.7605 15.2812L15.2737 12.768L10.5346 8.02887L15.2817 3.28171L12.7657 0.765728L8.01857 5.51289L3.25284 0.747158L0.73964 3.26036L5.50537 8.02609L0.744913 12.7865Z"
                                fill="#D7D7D7"
                            />
                        </svg>
                    </button>
                    <div className="flex w-full">{<div className="text-15 font-bold text-gray-400">{t("pma.Seguro que deseas hacerlo?")}</div>}</div>
                    <div className="flex w-full justify-end space-x-2">
                        <button
                            className="h-[2.1037rem] w-[5.7663rem] rounded-[1rem] bg-gray-10 px-2 text-15 font-bold text-gray-400"
                            onClick={() => close()}>
                            {t("pma.No")}
                        </button>
                        <button
                            className="h-[2.1037rem] w-[5.7663rem] rounded-[1rem] bg-primary-200 px-2 text-15 font-bold text-white"
                            onClick={type ? () => confirm(get(type, "id", "")) : () => confirm()}>
                            {t("pma.Si")}
                        </button>
                    </div>
                </div>
            </div>
        </NewFormModal>
    );
};

export default MassiveModal;
