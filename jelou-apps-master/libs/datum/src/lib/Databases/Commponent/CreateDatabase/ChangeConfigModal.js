import { CloseIcon2, ErrorIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { Modal } from "../Modals/Index";

const ChangeConfigModal = ({ closeModalConfig, configModal, selectColumn, clearFileds }) => {
    const { t } = useTranslation();

    const handleChangeColumn = (evt) => {
        evt.preventDefault();
        selectColumn(configModal.column);
        clearFileds();
        closeModalConfig();
    };

    return (
        <Modal closeModal={closeModalConfig} isShow={configModal.isShow} widthModal="w-[30rem] ">
            <section className="relative inline-block h-full w-[30rem] transform overflow-hidden rounded-20 bg-white text-left align-middle text-gray-400 shadow-xl transition-all">
                <div className="mt-3 mr-3 flex items-start justify-end">
                    <button
                        aria-label="Close"
                        onClick={(evt) => {
                            evt.preventDefault();
                            closeModalConfig();
                        }}>
                        <CloseIcon2 />
                    </button>
                </div>
                <div className="px-6 pt-2 pb-6">
                    <h2 className="mb-4 text-left text-xl font-normal leading-tight text-primary-200">{t("datum.warning.column")}</h2>
                    <p className="text-left text-base font-semibold text-gray-400">{t("datum.warning.column2")}</p>
                    <footer className="mt-4">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    closeModalConfig();
                                }}
                                className="h-10 w-28 rounded-20 bg-gray-10 font-semibold text-gray-400">
                                {t("buttons.cancel")}
                            </button>
                            <button type="submit" onClick={handleChangeColumn} className="button-gradient flex items-center justify-center">
                                {t("buttons.continue")}
                            </button>
                        </div>
                    </footer>
                </div>
            </section>
        </Modal>
    );
};

export default ChangeConfigModal;

export const EmptyColumnModal = ({ closeModal, isShow }) => {
    const { t } = useTranslation();

    return (
        <Modal closeModal={closeModal} isShow={isShow} widthModal="w-[30rem]">
            <section className="relative inline-block h-full w-[30rem] transform overflow-hidden rounded-20 bg-white text-left align-middle text-gray-400 shadow-xl transition-all">
                <div className="mt-3 mr-3 flex items-start justify-end">
                    <button
                        aria-label="Close"
                        onClick={(evt) => {
                            evt.preventDefault();
                            closeModal();
                        }}>
                        <CloseIcon2 />
                    </button>
                </div>
                <div className="px-6 pt-2 pb-6">
                    <h2 className="mb-3 flex items-center gap-2 text-left text-xl font-semibold text-[#EC5F4F]">
                        <ErrorIcon width={20} stroke="#EC5F4F" /> {t("datum.warning.unconfiguredColumns")}
                    </h2>
                    <p className="mb-2 text-left text-sm font-normal text-gray-400">{t("datum.warning.unconfiguredColumns2")}</p>

                    <footer className="mt-4">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    closeModal(false);
                                }}
                                className="h-10 w-28 rounded-20 bg-gray-10 font-semibold text-gray-400">
                                {t("buttons.return")}
                            </button>
                        </div>
                    </footer>
                </div>
            </section>
        </Modal>
    );
};
