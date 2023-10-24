import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { CloseIcon2 as CloseIconBold } from "@apps/shared/icons";

export function ImageModal({ children, isShow = false, closeModal = () => null, className = "" }) {
    return (
        <Transition appear show={isShow} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Dialog.Overlay className="fixed inset-0 bg-gray-400 bg-opacity-50" />
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95">
                        <section className={`relative inline-block h-users transform align-middle transition-all ${className}`}>
                            <div className="flex justify-end">
                                <button onClick={closeModal} className="mb-4 inline-block text-right">
                                    <CloseIconBold fill="#fff" fillOpacity={1} />
                                </button>
                            </div>
                            {children}
                        </section>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
