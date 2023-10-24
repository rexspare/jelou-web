import { useOnClickOutside } from "@apps/shared/hooks";
import { CloseIcon2, WarningIcon } from "@apps/shared/icons";
import React, { useRef } from "react";
import { ClipLoader } from "react-spinners";

const DiscardEmailModal = (props) => {
    const { onClose, onConfirm, isLoading = false, t } = props;
    const modalRef = useRef(null);
    useOnClickOutside(modalRef, () => onClose());
    return (
        <div className="fixed inset-x-0 top-0 z-[130] overflow-auto px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-smoke-light" />
            </div>
            <div ref={modalRef} className="relative z-70 min-h-20 w-[24rem] rounded-xl bg-white px-6 pt-6 pb-6">
                <span className="absolute right-[0.7rem] top-[0.7rem]" onClick={() => onClose()}>
                    <CloseIcon2 width={"1rem"} height={"1rem"} className={"z-120 fill-current text-gray-400 hover:cursor-pointer"} />
                </span>
                <div className="flex space-x-2">
                    <span className="pt-2">
                        <WarningIcon fill="#EC5F4F" width={"1.2rem"} height={"1.1rem"} className="fill-current text-[#EC5F4F]" />
                    </span>
                    <p className="flex-1 font-bold text-[#EC5F4F]">{t("pma.discardEmailTitle")}</p>
                </div>
                <div className="mt-3 flex flex-col text-sm">
                    <p className="flex-1 text-gray-500">{t("pma.discardEmailMessage")}</p>
                    <p className="pt-2 font-bold text-gray-400">{t("pma.wantToDoIt")}</p>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <div className={`hidden items-center lg:flex`}>
                        <button
                            className="flex items-center justify-center rounded-full border-transparent bg-[#F2F7FD] px-6 py-2 outline-none focus:outline-none"
                            onClick={() => onClose()}>
                            <span className="flex items-center justify-center text-sm font-bold text-gray-400">{t("pma.goBack")}</span>
                        </button>
                    </div>
                    <div className={`hidden items-center lg:flex`}>
                        <button
                            className="hover:bg-primary-light flex h-8 w-26 items-center justify-center rounded-full border-transparent bg-primary-200 px-10 py-2 outline-none focus:outline-none"
                            onClick={() => onConfirm()}>
                            <span className="group-hover:text-primary-hover w-full text-15 font-bold text-white">
                                {isLoading ? (
                                    <div className="tp-1 flex w-full items-center justify-center ">
                                        <ClipLoader size={"13"} color="white" />
                                    </div>
                                ) : (
                                    t("pma.yes")
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscardEmailModal;