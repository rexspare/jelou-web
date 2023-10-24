import { useOnClickOutside } from "@apps/shared/hooks";
import { CloseIcon2, SendIconReplies } from "@apps/shared/icons";
import React, { useRef } from "react";

const SentConfirmationModal = (props) => {
    const { onClose, onExit, emailNumber, t } = props;

    const modalRef = useRef(null);
    useOnClickOutside(modalRef, () => onClose());
    return (
        <div className="fixed inset-x-0 top-0 z-[130] overflow-auto px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-smoke-light" />
            </div>
            <div ref={modalRef} className="relative z-70 min-h-20 w-[24rem] rounded-xl bg-white px-6 pt-6 pb-6">
                <span className="absolute right-2 top-2" onClick={() => onClose()}>
                    <CloseIcon2 width={"1rem"} height={"0.7rem"} className={"z-120 fill-current text-gray-400 hover:cursor-pointer"} />
                </span>
                <div className="flex items-center space-x-2">
                    <span className="">
                        <SendIconReplies width={"1.2rem"} height={"1.1rem"} className="fill-current text-primary-200" />
                    </span>
                    <p className="flex-1 font-bold text-primary-200">{t("pma.emailSentTitle")}</p>
                </div>
                <div className="mt-3 flex flex-col text-xs">
                    <p className="flex-1 text-gray-500">
                        {t("pma.emailSentMessage")}
                        <span className="font-bold text-primary-200">{emailNumber}</span>
                    </p>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <div className={`hidden items-center lg:flex`}>
                        <button
                            className="flex items-center justify-center rounded-full border-transparent bg-[#F2F7FD] px-6 py-2 outline-none focus:outline-none"
                            onClick={() => onExit()}>
                            <span className="flex items-center justify-center text-xs font-bold text-gray-400">{t("pma.exit")}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SentConfirmationModal;