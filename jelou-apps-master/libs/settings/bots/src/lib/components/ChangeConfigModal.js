import { CloseIcon2 } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";

const ChangeConfigModal = ({ closeModalConfig, onConfirm }) => {
    const { t } = useTranslation();

    return (
        <Modal closeModal={closeModalConfig} isShow={true} withModal="w-[30rem] ">
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
                    <h2 className="mb-4 text-left text-xl font-normal leading-tight text-primary-200">
                        {t("Asegúrate de guardar tus cambios antes de cambiar de seccion")}
                    </h2>
                    <p className="text-left text-base font-semibold text-gray-400">
                        {t("Si deseas continuar sin guardar tus cambios, se perderá esta información")}
                    </p>
                    <footer className="mt-4">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    closeModalConfig(false);
                                }}
                                className="h-10 w-28 rounded-20 bg-gray-10 font-semibold text-gray-400">
                                {t("buttons.cancel")}
                            </button>
                            <button type="submit" onClick={onConfirm} className="button-gradient flex items-center justify-center">
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
