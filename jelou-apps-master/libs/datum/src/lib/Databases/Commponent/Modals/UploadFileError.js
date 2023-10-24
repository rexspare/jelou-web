import { useTranslation } from "react-i18next";

import { Modal } from "./Index";
import AttentionIcon from "../../Illustrations/AttentionIcon";

export const UploadFileError = ({ showModal, closeModal }) => {
    const { t } = useTranslation();

    return (
        <Modal closeModal={closeModal} isShow={showModal} widthModal="w-[30rem]">
            <section className="relative inline-block w-[30rem] transform overflow-hidden rounded-20 bg-white p-8 shadow-xl transition-all">
                <div className="flex mb-4 min-h-fit-content w-full flex-row place-items-start justify-center gap-x-7">
                    <div className="w-fit flex-none pt-2"> <AttentionIcon /> </div> 
                    <h2 className="text-left text-xl font-bold text-[#EC5F4F]">{t("datum.error.uploadFileError")}</h2>
                </div>
                <p className="text-left text-base font-bold text-gray-400">{t("datum.error.uploadFileErrorMessage")}</p>
                <footer className="mt-10 flex justify-end gap-4">
                        <button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                closeModal(true);
                            }}
                            className="h-9 button-gradient flex items-center font-bold justify-center">
                            {t("datum.ok")}
                        </button>
                </footer>
            </section>
        </Modal>
    );
}
