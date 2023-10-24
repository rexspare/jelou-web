import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import get from "lodash/get";

import { CloseIcon2 as CloseIconBold } from "@apps/shared/icons";
import { getMediaProducts } from "../../services/media";
import { Modal } from "../Modal";
import { renderMessage } from "@apps/shared/common";
import { deleteProduct } from "../../services/products";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export default function DeleteModal({ closeModal, isShow, product, refreshProductList }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [loadingImg, setLoadingImg] = useState(false);
    const [mediaList, setMediaList] = useState([]);

    const company = useSelector((state) => state.company);
    const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", null);

    useEffect(() => {
        if (!product.id || !app_id) return;
        setLoadingImg(true);
        getMediaProducts({ productId: product.id, app_id })
            .then((imgList) => {
                setMediaList(imgList);
                setLoadingImg(false);
            })
            .catch((err) => {
                setLoadingImg(false);
                console.error(err);
            });
        return () => {
            setMediaList([]);
        };
    }, [product.id, app_id]);

    const handleDeleteProductClick = (evt) => {
        evt.preventDefault();
        setLoading(true);

        const { id } = product;
        if (!id) {
            renderMessage(t("shop.notifications.deleteProductError"), MESSAGE_TYPES.ERROR);
            setLoading(false);
            return;
        }

        deleteProduct({ productId: id, app_id })
            .then(() => {
                refreshProductList();
                renderMessage(t("shop.notifications.deleteProductSuccess"), MESSAGE_TYPES.SUCCESS);
            })
            .catch((error) => {
                console.log("error al intentar eliminar un producto", { error, product, productid: id });
                renderMessage(t("shop.notifications.deleteProductError"), MESSAGE_TYPES.ERROR);
            })
            .finally(() => {
                setLoading(false);
                closeModal(false);
            });
    };

    return (
        <Modal className="w-[40rem] rounded-1" closeModal={closeModal} isShow={isShow}>
            <div className="flex items-start justify-end">
                <button
                    aria-label="Close"
                    onClick={(evt) => {
                        evt.preventDefault();
                        closeModal(false);
                    }}>
                    <CloseIconBold />
                </button>
            </div>
            <div className="flex gap-8 pb-10">
                <div className="w-[15rem]">
                    {loadingImg ? (
                        <div className="h-[10rem] w-[10rem]">
                            <Skeleton height="10rem" />
                        </div>
                    ) : mediaList.length > 0 ? (
                        <div className="flex h-[10rem] w-[10rem] items-center overflow-hidden rounded-[1.125rem] shadow-[0px_0px_10px_rgba(166,_180,_208,_0.25)]">
                            <img className="object-contain" src={mediaList[0]?.original_url} alt={""} />
                        </div>
                    ) : (
                        <div
                            className="flex h-[10rem] w-[10rem] items-center justify-center rounded-[1.125rem]"
                            style={{ boxShadow: "0px 0px 10px rgba(166, 180, 208, 0.25)" }}>
                            <svg
                                viewBox="0 0 100 100"
                                style={{
                                    enableBackground: "new 0 0 100 100",
                                }}
                                xmlSpace="preserve">
                                <path
                                    d="m89.96 15.15-50.5-7.44a4.791 4.791 0 0 0-5.43 4.03l-8.68 58.94a4.791 4.791 0 0 0 4.03 5.43l50.5 7.44c2.61.38 5.04-1.42 5.43-4.03L94 20.57a4.783 4.783 0 0 0-4.04-5.42zM78.43 64.64a2.275 2.275 0 0 1-2.59 1.92l-37.68-5.55a2.275 2.275 0 0 1-1.92-2.59l5.68-38.56a2.275 2.275 0 0 1 2.59-1.92l37.68 5.55c1.24.18 2.11 1.34 1.92 2.59l-5.68 38.56z"
                                    style={{
                                        fill: "#afafaf",
                                    }}
                                />
                                <path
                                    d="m40.32 54.83.85-5.77c.13-.89.6-1.69 1.31-2.25l8.81-6.89a2.39 2.39 0 0 1 3.53.67l4.13 7.08 18.13-10.85c1.08-.64 2.42.25 2.23 1.49l-3.2 21.74a2.15 2.15 0 0 1-2.48 1.82c-6.42-1.04-25.32-4.09-31.58-4.8a1.965 1.965 0 0 1-1.73-2.24z"
                                    style={{
                                        fill: "#bababa",
                                    }}
                                />
                                <path
                                    d="M26.63 38.61 8.97 43.75c-2.2.64-3.48 2.94-2.87 5.15l11.26 40.37c.64 2.3 3.08 3.6 5.35 2.86l28.47-9.35-23.75-3.15a5.591 5.591 0 0 1-4.82-6.18l4.02-34.84z"
                                    style={{
                                        fill: "#e2e2e2",
                                    }}
                                />
                            </svg>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="mb-4 text-xl font-normal text-primary-200">
                        {t("shop.modal.deleteProductTitle1_1")} <span className="font-bold">{product?.name} </span>
                        {t("shop.modal.deleteProductTitle1_2")}
                    </h2>
                    <p className="text-base text-gray-400">{t("shop.modal.deleteImgTitle2")}</p>

                    <footer className="mt-4">
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
