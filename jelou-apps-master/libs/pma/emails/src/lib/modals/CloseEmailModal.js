import { useOnClickOutside } from "@apps/shared/hooks";
import { CloseIcon2, TrashIcon, WarningIcon } from "@apps/shared/icons";
import { useRef } from "react";
import { ClipLoader } from "react-spinners";

const CloseEmailModal = (props) => {
    const { onClose, onSave, onDiscard, isLoadingDiscard, saveIsLoading, t } = props;

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
                    <p className="flex-1 font-bold text-[#EC5F4F]">{t("pma.closeEmailTitle")}</p>
                </div>
                <div className="mt-3 flex flex-col text-sm">
                    <p className="flex-1 text-gray-500">
                        {t("pma.closeEmailMessage")}
                    </p>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <div className={`itemss-center hidden lg:flex`}>
                        <button
                            disabled={saveIsLoading || isLoadingDiscard}
                            onClick={() => onDiscard()}
                            className="group flex h-8 w-32 items-center space-x-2 rounded-[12px] border-default !border-[#D7DCE9] px-4 py-2 font-bold text-gray-400 disabled:hover:cursor-not-allowed">
                            <span>
                                <TrashIcon width="14" height="18" className="fill-current text-gray-400 group-hover:text-gray-400" />
                            </span>
                            {isLoadingDiscard ? (
                                <span className="flex w-full items-center justify-center">
                                    <ClipLoader size={"20px"} color="#D7DCE9" />
                                </span>
                            ) : (
                                <span className="text-15 group-hover:text-gray-400 group-hover:text-opacity-75">{t("pma.discard")}</span>
                            )}
                        </button>
                    </div>
                    <div className={`hidden items-center lg:flex`}>
                        <button
                            disabled={saveIsLoading}
                            onClick={() => {
                                onSave(true, true);
                            }}
                            className="group flex h-8 w-28 items-center space-x-2 rounded-[12px] bg-[#BFECF1] px-4  py-2 font-bold text-gray-400 disabled:hover:cursor-not-allowed">
                            <span className="group-hover:text-primary-hover w-full text-15 text-[#008D9D]">
                                {saveIsLoading ? (
                                    <div className="tp-1 flex w-full items-center justify-center ">
                                        <ClipLoader size={"20px"} color="#00B3C7" />
                                    </div>
                                ) : (
                                    <span className="group-hover:text-primary-hover w-full text-15 text-[#008D9D]">{t("pma.save")}</span>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CloseEmailModal;