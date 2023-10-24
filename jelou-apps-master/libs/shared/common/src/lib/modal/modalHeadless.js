import { CloseIcon2, LoadingSpinner } from "@apps/shared/icons";
import { Dialog, Transition } from "@headlessui/react";

export function ModalHeadless({
    children,
    isShowModal = false,
    closeModal = () => null,
    handleClickPrimaryButton = () => null,
    className = "relative inline-block w-full max-w-md transform overflow-hidden rounded-20 bg-white text-left align-middle shadow-xl transition-all",
    titleClassName = "mb-5 text-base",
    titleModal = null,
    textButtonSecondary = "",
    textButtonPrimary = "",
    loading = false,
    disablePrimaryBtn = false,
    showButtons = false,
    icon = null,
    classNamePrimaryButton = "button-gradient-xl disabled:cursor-not-allowed disabled:bg-opacity-60",
    classNameSecondaryButton = "rounded-3xl border-transparent bg-gray-10 px-5 py-2 text-base font-bold text-gray-400 outline-none",
} = {}) {
    return (
        <Transition appear show={isShowModal} as={"div"}>
            <Dialog as="div" className="relative z-10" open={isShowModal} onClose={() => null}>
                <Transition.Child as={"div"} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={"div"}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel>
                                <section className={className}>
                                    <div className="flex items-start justify-end pr-4 pt-4">
                                        <button
                                            aria-label="Close"
                                            onClick={(evt) => {
                                                evt.preventDefault();
                                                closeModal();
                                            }}
                                        >
                                            {icon ? icon : <CloseIcon2 />}
                                        </button>
                                    </div>
                                    {titleModal && <h3 className={titleClassName}>{titleModal}</h3>}
                                    {children}
                                    {showButtons && (
                                        <footer className="flex h-20 items-center justify-end gap-4 bg-white pr-8">
                                            <button
                                                type="button"
                                                onClick={(evt) => {
                                                    evt.preventDefault();
                                                    closeModal();
                                                }}
                                                className={classNameSecondaryButton}
                                            >
                                                {textButtonSecondary}
                                            </button>
                                            <button onClick={handleClickPrimaryButton} disabled={disablePrimaryBtn || loading} type="submit" className={classNamePrimaryButton}>
                                                {loading ? (
                                                    <div className="flex justify-center">
                                                        <LoadingSpinner color="#fff" />
                                                    </div>
                                                ) : (
                                                    textButtonPrimary
                                                )}
                                            </button>
                                        </footer>
                                    )}
                                </section>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
