import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";

export function ModalHeadlessSimple({ children, isShow = false, closeModal = () => null, className = "max-w-md rounded-md" }) {
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
                        <section
                            className={`relative inline-block transform overflow-hidden rounded-20 bg-white text-left align-middle text-gray-400 shadow-xl transition-all ${className}`}>
                            {children}
                        </section>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
