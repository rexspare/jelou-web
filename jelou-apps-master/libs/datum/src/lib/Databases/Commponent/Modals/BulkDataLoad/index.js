/* Modal that is displayed when populating a database from a file. */

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export function BulkDataLoadModal({
    children,
    showModal = false,
    closeModal = () => null,
    className = "max-w-7xl rounded-md",
    classNameActivate = "px-8 pt-8 overflow-y-scroll",
}) {
    return (
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto pl-[5.2rem]" onClose={closeModal}>
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
                        <section
                            className={`relative inline-block w-5/6 transform overflow-hidden bg-white text-left align-middle text-gray-400 shadow-xl transition-all ${className} ${classNameActivate}`}>
                            {children}
                        </section>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}