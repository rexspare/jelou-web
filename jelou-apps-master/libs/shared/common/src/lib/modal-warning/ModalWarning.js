import { AttentionIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { ModalHeadlessSimple } from "../modal/Modal-headless";

export const ModalWarning = ({ showModal, closeModal, closeAndClear }) => {
    const { t } = useTranslation();

    return (
        <ModalHeadlessSimple closeModal={closeModal} isShow={showModal} widthModal="w-[30rem]">
            <section className="relative -mb-4 inline-block h-[15rem] w-[30rem] transform overflow-hidden rounded-20 bg-white py-8 px-16 shadow-xl transition-all">
                <div className="min-h-fit-content mb-4 flex w-full flex-row place-items-start justify-center gap-x-7">
                    <div className="w-fit flex-none pt-2">
                        {" "}
                        <AttentionIcon />{" "}
                    </div>
                    <h2 className="text-left text-xl font-bold text-[#EC5F4F]">{t("datum.uploadModal.closeModalWarning")}</h2>
                </div>
                <p className="text-left text-base font-bold text-gray-400">{t("datum.confirmWarning")}</p>
                <footer className="mt-10 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            closeModal(true);
                        }}
                        className="h-9 w-28 rounded-3xl bg-gray-10 font-bold text-gray-400"
                    >
                        {t("datum.goBack")}
                    </button>
                    <button
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            closeModal(true);
                            closeAndClear();
                        }}
                        className="button-gradient flex h-9 items-center justify-center font-bold"
                    >
                        {t("datum.yes")}
                    </button>
                </footer>
            </section>
        </ModalHeadlessSimple>
    );
};
