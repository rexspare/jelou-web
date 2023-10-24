import ReactDOM from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

const Modal = (props) => {
    const { children } = props;

    return ReactDOM.createPortal(children, document.getElementById("root"));
};

export default Modal;

export function ModalHeadless({ isOpen, closeModal, children, className = "", title = "", classTitle = "" } = {}) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-100 overflow-y-auto" onClose={closeModal}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-gray-400 bg-opacity-50" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95">
                        <div
                            className={`inline-block w-[22rem] transform overflow-hidden rounded-20 bg-white text-left align-middle shadow-xl transition-all ${className}`}>
                            <div className="flex w-full items-start justify-end pt-3 pr-3">
                                <button className="z-100" onClick={closeModal}>
                                    <svg width={11} height={13} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="m.766 12.787 2.516 2.515 4.76-4.76 4.74 4.74 2.512-2.514-4.739-4.74 4.748-4.746L12.787.766 8.039 5.513 3.274.747.76 3.26l4.765 4.766-4.76 4.76Z"
                                            fill="#D7D7D7"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <h3 className={`w-full truncate pl-4 text-left text-base font-bold text-gray-400 md:text-xl ${classTitle}`}>{title}</h3>
                            {children}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
