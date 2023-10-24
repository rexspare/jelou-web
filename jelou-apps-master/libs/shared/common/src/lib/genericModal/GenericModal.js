import { CloseIcon1 } from "@apps/shared/icons";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const GenericModal = ({ showModal, onClose, closeModal, onConfirm, width = "none", icon = false, title, children, theme }) => {
    return (
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-120" open={showModal} onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
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
                            leaveTo="opacity-0 scale-95">
                            <Dialog.Panel
                                style={{
                                    width,
                                }}>
                                <header
                                    className={`flex h-[3.6rem] items-center justify-between rounded-t-xl ${
                                        theme === "alert" ? "bg-[#FEEEEE]" : "bg-primary-600"
                                    }   px-6`}>
                                    <div className="flex items-center gap-3">
                                        {icon && icon}
                                        <div
                                            className={`max-w-56 truncate pr-3 text-base font-semibold ${
                                                theme === "alert" ? "text-red-500" : "text-primary-200 "
                                            }  md:max-w-xs `}>
                                            {title}
                                        </div>
                                    </div>
                                    <span onClick={closeModal}>
                                        <CloseIcon1
                                            className={`cursor-pointer fill-current ${
                                                theme === "alert" ? "text-red-500" : "text-primary-200 "
                                            }  text-primary-200`}
                                            width="1rem"
                                            height="1rem"
                                        />
                                    </span>
                                </header>
                                <div className="flex w-full flex-1 flex-col justify-between gap-4">{children}</div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default GenericModal;
