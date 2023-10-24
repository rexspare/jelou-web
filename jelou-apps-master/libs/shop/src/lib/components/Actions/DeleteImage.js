import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CloseIcon2 as CloseIconBold } from "@apps/shared/icons";
import { Modal } from "../Modal";
import { renderMessage } from "@apps/shared/common";
import { deleteImageProduct } from "../../services/media";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export default function DeleteImageModal({ closeModal, isShow, productId, imageId, imgUrl, deleteImageFromProduct }) {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const company = useSelector((state) => state.company);

    const handleDeleteProductClick = (evt) => {
        evt.preventDefault();
        setLoading(true);

        if (!productId || !imageId) {
            renderMessage(t("shop.notifications.deleteImgError"), MESSAGE_TYPES.ERROR);
            console.error("Error al eliminar la imagen del producto", { productId, imageId });
            setLoading(false);
            return;
        }

        const app_id = company.properties?.shopCredentials.jelou_ecommerce?.app_id;
        deleteImageProduct({ app_id, productId, imageId })
            .then(() => {
                deleteImageFromProduct(imageId);
                renderMessage(t("shop.notifications.deleteImgSuccess"), MESSAGE_TYPES.SUCCESS);
            })
            .catch((error) => {
                console.error("error al eliminar una imagen del producto", { productId, imageId, error });
                renderMessage(error, MESSAGE_TYPES.ERROR);
            })
            .finally(() => {
                closeModal();
                setLoading(false);
            });
    };

    return (
        <Modal className="w-[35rem] rounded-[1.375rem]" closeModal={closeModal} isShow={isShow}>
            <div className="flex justify-end">
                <button aria-label="Close" onClick={closeModal} className="pt-2">
                    <CloseIconBold />
                </button>
            </div>
            <div className="flex gap-8 pb-10 font-bold">
                {imgUrl && (
                    <div className="w-[15rem]">
                        <div className="flex h-[10rem] w-[10rem] items-center overflow-hidden rounded-[1.125rem] shadow-[0px_0px_10px_rgba(166,_180,_208,_0.25)]">
                            <img className="object-contain" src={imgUrl} alt={""} />
                        </div>
                    </div>
                )}
                <div>
                    <h2 className="text-xl text-primary-200">{t("shop.modal.deleteImgTitle")}</h2>
                    <p className="my-4 text-base text-gray-400">{t("shop.modal.deleteImgTitle2")}</p>

                    <footer>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    closeModal(false);
                                }}
                                className="h-10 w-28 rounded-20 bg-gray-10 font-semibold text-gray-400">
                                {t("shop.modal.cancel")}
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleDeleteProductClick}
                                className="button-gradient flex items-center justify-center">
                                {loading ? (
                                    <svg className="sh-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <span>{t("shop.modal.remove")}</span>
                                )}
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </Modal>
    );
}
