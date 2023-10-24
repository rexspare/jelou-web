import React, { useRef, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";

export const DBFromFileModal = ({ isOpen, closeModal }) => {
    const inputFileElement = useRef(null);

    const handleInputFileClick = () => {
        inputFileElement.current.click();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
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
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-15" />
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95">
                        <section className="inline-block w-full max-w-md transform overflow-hidden rounded-20 bg-white p-3 text-left align-middle shadow-xl transition-all">
                            <div className="rounded-20 bg-primary-600 pt-11 pb-9">
                                <header className="flex flex-col items-center ">
                                    <IconArchiveFile />
                                    <Dialog.Title as="h3" className="text-center text-xl font-extrabold leading-6 text-gray-400 ">
                                        Arrastra tu documento aquí <br /> para empezar a cargar
                                    </Dialog.Title>
                                </header>
                                <div class="mx-auto my-4 flex w-56 items-center gap-2 font-extrabold text-gray-400">
                                    <span className=" h-0.5 w-full bg-gray-100/25"></span>O<span className=" -gray-100/25 h-0.5 w-full"></span>
                                </div>

                                <footer className="flex justify-center">
                                    <button onClick={handleInputFileClick} className="button-gradient w-auto whitespace-nowrap">
                                        Buscar archivo
                                    </button>
                                    <input ref={inputFileElement} type="file" className="hidden" />
                                </footer>
                            </div>
                        </section>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

const IconArchiveFile = () => (
    <svg width={96} height={96} fill="none">
        <path fill="url(#a)" d="M0 0h96v96H0z" />
        <defs>
            <pattern id="a" patternContentUnits="objectBoundingBox" width={1} height={1}>
                <use xlinkHref="#b" transform="scale(.00195)" />
            </pattern>
            <image
                id="b"
                width={512}
                height={512}
                xlinkHref="data:image/png;base64,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"
            />
        </defs>
    </svg>
);
