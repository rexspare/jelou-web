import { Modal } from "../Modals/Index";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { CloseIcon2, TrashIcon } from "@apps/shared/icons";

const DeleteWebhookModal = ({ closeModal = () => null, isShow = false, webhook, deleteWebhook = () => null, loadingDelete } = {}) => {
    const { t } = useTranslation();

    return (
        <Modal closeModal={closeModal} isShow={isShow} widthModal="w-[50vh]">
            <section className="relative inline-block h-full w-full transform overflow-hidden rounded-20 bg-white text-left font-bold text-gray-400 shadow-xl transition-all">
                <header className="flex h-12 w-full items-center justify-between bg-red-15 px-3 text-lg text-primary-200 lg:h-14 lg:px-5 lg:text-xl">
                    <div className="flex items-center space-x-3 px-3">
                        <TrashIcon width="1rem" height="1.125rem" fill={"#EB5E50"} />
                        <span className="text-red-1050">{t("datum.triggers.deleteModal.title")}</span>
                    </div>
                    <button
                        aria-label="Close"
                        className="w-12"
                        onClick={(evt) => {
                            closeModal();
                            evt.preventDefault();
                        }}>
                        <CloseIcon2 />
                    </button>
                </header>
                <main className="flex h-auto flex-col space-y-4 p-4 lg:p-8">
                    <div className="flex flex-col space-y-3 font-normal text-gray-400">
                        <span className="text-base font-bold text-secondary-250 lg:text-xl">{t("datum.Esta accion no se puede deshacer")}</span>
                        <span>{t("datum.triggers.deleteModal.subtitle")}</span>
                        <span className="self-center font-semibold italic underline text-clip w-fit">{webhook?.url}</span>
                        <span className="text-sm font-semibold lg:text-lg">{t("datum.Desear hacerlo")}</span>
                    </div>
                    <button
                        className={`w-[11rem] self-center rounded-full bg-red-1050 py-3 text-13 text-white lg:w-64 lg:text-base ${
                            loadingDelete ? "cursor-not-allowed bg-opacity-50" : ""
                        }`}
                        disabled={loadingDelete}
                        onClick={() => deleteWebhook(webhook)}>
                        {loadingDelete ? <ClipLoader size={"1.25rem"} color="white" /> : t("datum.Si, deseo eliminar")}
                    </button>
                </main>
            </section>
        </Modal>
    );
};

export default DeleteWebhookModal;
