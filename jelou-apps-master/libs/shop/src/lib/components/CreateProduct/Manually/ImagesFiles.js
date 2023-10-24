import { DropZoneFiles } from "@apps/shared/common";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * It takes an array of objects, and returns an array of strings
 * @param {Object[]} imageList - An array of objects that contain the image url.
 * @returns {String[]} An array of image links
 */
const parseImagesToLinks = (imageList) => {
    return imageList.map((image) => image?.original_url);
};

/**
 * @param {{
 * imagesList: Object[],
 * handleDeleteImage: (link: string) => Promise<void>,
 * handleImage: (file: File) => Promise<string>,
 * }} props these are the props that the component receives
 * - imagesList: An array of objects that contain the image url.
 * - handleDeleteImage: A function that deletes an image from the imagesList array.
 * - handleImage: A function that adds an image to the imagesList array and it's return the url for the img.
 */
export function ImageFileInput({ imagesList, handleDeleteImage, handleImage }) {
    const { t } = useTranslation();
    const linkList = useMemo(() => parseImagesToLinks(imagesList), [imagesList]);

    return (
        <DropZoneFiles
            principalText={t("shop.images.dropzone")}
            searchLinkKey="original_url"
            handleAddFile={handleImage}
            accept=".png,.jpg,.jpeg"
            handleRemoveFile={handleDeleteImage}
            linkList={linkList}
            setDisableButtonCreateData={() => null}
        />
    );
}
