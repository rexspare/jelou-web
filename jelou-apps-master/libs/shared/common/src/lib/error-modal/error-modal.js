import { WarningIcon, CloseIcon2 } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";
import { useRef } from "react";

const ErrorModal = (props) => {
    const { onClose, children, title = "", cancelButton, confirmButton = "Aceptar" } = props;

    const modalRef = useRef(null);
    useOnClickOutside(modalRef, () => onClose());

    return (
        <div className="fixed inset-x-0 top-0 z-[130] overflow-auto px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-400 bg-opacity-50" />
            </div>
            <div
                ref={modalRef}
                className="relative inline-block w-full max-w-md scale-100 transform overflow-hidden rounded-20 bg-white text-left align-middle text-gray-400 opacity-100 shadow-xl transition-all">
                <header className="flex h-12 items-center justify-between bg-[#FDEDEA] px-10 text-[#9E3223]">
                    <h2 className="flex items-center gap-2 text-xl font-bold">
                        <WarningIcon fill="#9E3223" width={"1.2rem"} height={"1.1rem"} className="fill-current text-[#9E3223]" />
                        <span className="whitespace-nowrap">{title}</span>
                    </h2>

                    <button className="absolute right-16 top-16" onClick={onClose}>
                        <CloseIcon2 />
                    </button>
                </header>

                <div className="my-6 space-y-5 px-10 text-gray-400">
                    {children}

                    <footer className="flex w-full justify-end gap-4">
                        {cancelButton && (
                            <button className="h-[2.25rem] rounded-xl bg-primary-700 px-4 text-15 font-semibold text-gray-400" onClick={onClose}>
                                {cancelButton}
                            </button>
                        )}
                        <button
                            // disabled={disableButton}
                            className="flex h-[2.25rem] w-fit items-center justify-center rounded-xl bg-[#EC5F4F] px-4 text-15 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={onClose}>
                            {confirmButton}
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
