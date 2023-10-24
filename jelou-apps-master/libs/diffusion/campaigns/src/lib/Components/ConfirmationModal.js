import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";

const ConfirmationModal = (props) => {
    const { open, setOpen, sendHSM, selectedHsm, fileSize, time, campaignDate, campaignTime, campaign } = props;
    const cancelButtonRef = useRef();
    const { t } = useTranslation();
    const fecha = time === 1 ? t("ConfirmationModal.now") : `${campaignDate} ${t(`ConfirmationModal.at`)} ${campaignTime}`;
    const [loading, setLoading] = useState(false);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" static className="fixed inset-0 z-10 overflow-y-auto" initialFocus={cancelButtonRef} open={open} onClose={setOpen}>
                <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle">
                            <div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="h3" className="mb-4 text-lg font-medium leading-6 text-gray-400">
                                        {t("ConfirmationModal.confirm")}
                                    </Dialog.Title>
                                    <div className="mb-6">
                                        <p className="mb-2 text-sm text-gray-400 text-opacity-75">
                                            <b>{t("ConfirmationModal.campaign")}:</b> {campaign}
                                        </p>
                                        <p className="mb-2 text-sm text-gray-400 text-opacity-75">
                                            <b>{t("ConfirmationModal.template")}:</b> {selectedHsm.template}
                                        </p>
                                        <p className="mb-2 text-sm text-gray-400 text-opacity-75">
                                            <b>{t("ConfirmationModal.receipts")}:</b> {fileSize}
                                        </p>
                                        <p className="text-sm text-gray-400 text-opacity-75">
                                            <b>{t("ConfirmationModal.sentDate")}:</b> {fecha}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mx-10 mt-5 flex flex-row justify-between">
                                <button
                                    type="button"
                                    className="w-32 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                                    onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}>
                                    {t("buttons.cancel")}
                                </button>
                                {loading ? (
                                    <button type="button" className="button-primary ml-4 w-32">
                                        {t("ConfirmationModal.send")}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="button-primary ml-4 w-32"
                                        onClick={() => {
                                            setLoading(true);
                                            sendHSM();
                                        }}>
                                        {t("ConfirmationModal.send")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ConfirmationModal;
