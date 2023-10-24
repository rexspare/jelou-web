import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BeatLoader } from "react-spinners";
import get from "lodash/get";
import { useTranslation } from "react-i18next";

const DeleteSetting = (props) => {
    const { openDelete, setOpenDelete, removeConfiguration, loading, configuration } = props;
    const { t } = useTranslation();

    const cancelButtonRef = useRef();

    return (
        <Transition.Root show={openDelete} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed inset-0 z-10 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={openDelete}
                onClose={setOpenDelete}>
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
                        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                            <div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="h3" className="mb-4 text-lg font-medium leading-6 text-gray-400">
                                        {`${t("DeleteSetting.changes")}: ${get(configuration, "name", "")}`}
                                    </Dialog.Title>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:flex sm:grid-flow-row-dense sm:flex-row sm:justify-between">
                                <button
                                    type="button"
                                    className="w-32 !rounded-full border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400 focus:outline-none"
                                    onClick={() => setOpenDelete(false)}
                                    ref={cancelButtonRef}>
                                    {t("buttons.cancel")}
                                </button>
                                {loading ? (
                                    <button
                                        type="button"
                                        className="button-primary focus:ring-2 focus:ring-gray-60 inline-flex w-32 items-center justify-center !rounded-full focus:outline-none focus:ring-offset-2 sm:col-start-2 sm:text-sm">
                                        <div className="mt-1 w-1/2 leading-9">
                                            <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="button-primary focus:ring-2 focus:ring-gray-60 inline-flex h-12 w-32 items-center justify-center !rounded-full text-white focus:outline-none focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                        onClick={() => removeConfiguration()}>
                                        {t("buttons.delete")}
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

export default DeleteSetting;
