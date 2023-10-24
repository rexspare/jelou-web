import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { ImageFileInput } from "../ImagesFiles";
import { FooterBtns } from "../PrincipalDataPanel/FooterBtns";
import { INPUTS_NAMES, STEPS_IDS } from "../../../../constants";
import { HeaderPanel } from "../HeaderPanel";
const DeleteImageModal = lazy(() => import("../../../Actions/DeleteImage"));

export const UploadImagesData = ({ product, closeModal, goBackPanel, goToNextPanel, handleAddProductData, isUpdate, loading, actionProduct }) => {
    const [imagesList, setImagesList] = useState([]);
    const [showDeleteImgModal, setShowDeleteImgModal] = useState(null);

    const { t } = useTranslation();

    /**
     * Deletes an image from the imagesList array locally.
     * @param mediaUrl - The url of the image to be deleted.
     */
    const deleteImageLocaly = (mediaUrl) => {
        setImagesList((preState) => preState.filter((img) => img.original_url !== mediaUrl));
    };

    /**
     * It takes an image id as an argument and returns a new array of images without the image with the
     * given id
     * @param imageId - the id of the image to be deleted
     */
    const deleteImageFromProduct = (imageId) => {
        const mediaList = product[INPUTS_NAMES.IMAGES];
        const newMediaList = mediaList.filter((img) => img.id !== imageId);
        handleAddProductData({ [INPUTS_NAMES.IMAGES]: newMediaList });
    };

    /**
     * Deletes an image from the imagesList array locally and from the server.
     * @param {String} mediaUrl - The url of the image to be deleted.
     * @param {String} keyToDelet - This is the key of the image object in the array.
     * @returns A promise that resolves to nothing.
     */
    const handleDeleteImage = (mediaUrl) => {
        const mediaList = product[INPUTS_NAMES.IMAGES] ?? [];
        const imageToDelete = mediaList.find((img) => img.original_url === mediaUrl);

        // If the img's has an id, it means that it's already in the server
        if (imageToDelete && imageToDelete?.id) {
            setShowDeleteImgModal({ imgUrl: mediaUrl, imageId: imageToDelete.id, productId: product.id });
            return;
        }

        deleteImageLocaly(mediaUrl);
        return Promise.resolve();
    };

    /**
     * It takes a file, adds it to the imagesList array, and returns a URL
     * @param {File} file - The file that was uploaded
     * @returns A promise that resolves to a URL.
     */
    const handleImage = (file) => {
        setImagesList((preState) => [...preState, file]);
        const url = URL.createObjectURL(file);
        return Promise.resolve(url);
    };

    const comeBackPanel = () => {
        isUpdate ? closeModal() : goBackPanel(STEPS_IDS.IMAGES, STEPS_IDS.PRINCIPAL_DATA);
    };

    const saveDataAndGoToNextPanel = (newImgList) => {
        handleAddProductData(newImgList);
        goToNextPanel(STEPS_IDS.IMAGES, STEPS_IDS.PRICES);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newList = product[INPUTS_NAMES.IMAGES] ? [...product[INPUTS_NAMES.IMAGES], ...imagesList] : imagesList;
        const newImgList = { [INPUTS_NAMES.IMAGES]: newList };

        const action = isUpdate ? actionProduct : saveDataAndGoToNextPanel;
        action(newImgList);
    };

    const labelBtnPrincipal = isUpdate ? t("buttons.save") : t("buttons.next");
    const labelBtnSecondary = isUpdate ? t("buttons.close") : t("buttons.back");

    return (
        <>
            <HeaderPanel closeModal={closeModal} title={t("shop.images.title")} />

            <div className="h-[29.75rem]">
                <ImageFileInput handleDeleteImage={handleDeleteImage} handleImage={handleImage} imagesList={product[INPUTS_NAMES.IMAGES] ?? []} />
                {!isUpdate && <span className="text-[#A6B4D0]">{t("shop.images.optionalStep")}</span>}
            </div>

            <form onSubmit={handleSubmit} className="grid items-end">
                <FooterBtns
                    closeModal={comeBackPanel}
                    labelBtnPrincipal={labelBtnPrincipal}
                    labelBtnSecondary={labelBtnSecondary}
                    loading={loading}
                />
            </form>

            <Suspense fallback={null}>
                {showDeleteImgModal && (
                    <DeleteImageModal
                        closeModal={() => setShowDeleteImgModal(null)}
                        isShow={Boolean(showDeleteImgModal)}
                        deleteImageFromProduct={deleteImageFromProduct}
                        {...showDeleteImgModal}
                    />
                )}
            </Suspense>
        </>
    );
};
