import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { CloseIcon, SpinnerIcon } from "@builder/Icons";

export type ModalProps = {
    isOpen: boolean;
    closeModal?: () => void;
    children: React.ReactNode;
    className?: string;
    handleClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    isDisable?: boolean;
    loading?: boolean;
    showClose?: boolean;
    primaryBtnLabel?: string;
    secondaryBtnLabel?: string;
    showBtns?: boolean;
};

export function ModalHeadless({
    showBtns = true,
    loading = false,
    showClose = true,
    isDisable = true,
    secondaryBtnLabel = "",
    handleClick = () => null,
    primaryBtnLabel = "Guardar",
    className = "w-full max-w-lg",
    isOpen,
    children,
    closeModal,
}: ModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => null}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`transform rounded-1 bg-white text-left align-middle shadow-xl transition-all ${className}`}>
                                {showClose && (
                                    <header className="py-4 px-7">
                                        <button onClick={closeModal} className="absolute right-1.5 top-1.5 text-gray-400/60">
                                            <CloseIcon />
                                        </button>
                                    </header>
                                )}
                                {children}
                                {showBtns && (
                                    <footer className="flex justify-end gap-2 pt-4 pb-6 pr-7">
                                        {secondaryBtnLabel && (
                                            <button
                                                onClick={closeModal}
                                                className="h-8 min-w-1 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {secondaryBtnLabel}
                                            </button>
                                        )}
                                        <button
                                            disabled={isDisable}
                                            onClick={handleClick}
                                            className="flex h-8 min-w-1 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {loading ? <SpinnerIcon /> : primaryBtnLabel}
                                        </button>
                                    </footer>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
