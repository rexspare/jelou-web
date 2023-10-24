import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CloseIcon, IconArchiveFile, LoadingSpinner } from "@apps/shared/icons";

import { MESSAGE_TYPES, TYPES_FILE, unitInMB } from "@apps/shared/constants";
import useRenderFileIcon from "./renderFileIcon";
import { validatorFile } from "./utils";
import renderMessage from "../toast-messages/toast-messages";

/**@typedef {import('./dropzone').DropZoneFilesProps} DropZoneFilesProps */

/**
 * This component is a file DropZone in which you can upload files and display them in drag and drop.
 * It also allows you to delete them.
 * @param {DropZoneFilesProps} DropZoneProps The component's porps are:
 * - linkList: List of file links displayed in the dropzone.
 * - accept: The type of files that can be uploaded.
 * - searchLinkKey: It is the key with which the link of the document will be searched in the object.
 * - setDisableButtonCreateData: Function that disables the main button, wihle uploading a file.
 * - handleAddFile: Function that is executed when a file is uploaded.
 * - handleRemoveFile: Function that is executed when a file is deleted.
 * - principalText: Text that is displayed in the dropzone.
 */
export function DropZoneFiles({
    linkList = [],
    principalText = "",
    accept = undefined,
    searchLinkKey = "mediaUrl",
    setDisableButtonCreateData = () => null,
    handleAddFile,
    handleRemoveFile,
    isDisable = false,
} = {}) {
    const [imagesList, setImagesList] = useState([]);
    const [uploadFileLoading, setUploadFileLoading] = useState({});
    const [deleteFileLoading, setDeleteFileLoading] = useState({});

    const inputFileRf = useRef(null);

    const { t } = useTranslation();
    const { renderImg } = useRenderFileIcon();

    useEffect(() => {
        const loadingFiles = [...Object.values(uploadFileLoading), ...Object.values(deleteFileLoading)];

        const allStoppedLoading = loadingFiles.every((loading) => loading === false);
        setDisableButtonCreateData(!allStoppedLoading);
    }, [uploadFileLoading, deleteFileLoading]);

    /**
     * @param {File} file The file that will be uploaded
     */
    const addFileToList = (file) => {
        const { hasError, message } = validatorFile(file, imagesList, accept);

        if (hasError) {
            renderMessage(message, "error");
            return;
        }

        setUploadFileLoading((preState) => ({ ...preState, [file.name]: true }));
        setImagesList((preState) => [...preState, file]);

        handleAddFile(file).then((url) => {
            setImagesList((preState) => {
                const index = preState.findIndex((img) => img.name === file.name);
                preState[index][searchLinkKey] = url;
                return [...preState];
            });
            setUploadFileLoading((preState) => ({ ...preState, [file.name]: false }));
        });
    };

    const handleDeleteImage = ({ mediaUrl = null } = {}) => {
        if (!mediaUrl) {
            renderMessage(t("datum.error.deleteFile"), MESSAGE_TYPES.ERROR);
            console.log("Error eliminando archivo", { mediaUrl });
            return;
        }

        setDeleteFileLoading((preState) => ({ ...preState, [mediaUrl]: true }));

        handleRemoveFile(mediaUrl)
            .then(() => {
                setImagesList((preState) => preState.filter((img) => img[searchLinkKey] !== mediaUrl));
            })
            .catch(() => {
                renderMessage(t("datum.error.deleteFile"), "error");
                console.log("Error eliminando archivo", { mediaUrl });
            })
            .finally(() => setDeleteFileLoading((preState) => ({ ...preState, [mediaUrl]: false })));
    };

    /**
     * @param {DragEvent} evt is the event that is triggered when a file is dropped.
     */
    const handleOnDrop = (evt) => {
        if (isDisable) return;

        evt.stopPropagation();
        evt.preventDefault();

        const files = evt.dataTransfer.files;
        Object.values(files).forEach((file) => {
            addFileToList(file);
        });
    };

    const handleOpenSearchFile = (evt) => {
        evt.preventDefault();
        inputFileRf.current.click();
    };

    const handleSelectFiles = (evt) => {
        evt.preventDefault();

        const files = evt.target.files;
        Object.values(files).forEach((file) => {
            addFileToList(file);
        });
    };

    /**
     * It take a file and to detecte if is a link or file object.
     * @param {File | String} file - The file to be parsed.
     * @returns {{link: string, extension: string, isFile: boolean}} `link` is the file's link, `extension` is the file's extension, and `isFile` is a boolean indicating whether the file is a file or a link
     */
    const parseFile = (file) => {
        const isAFile = Boolean(file?.name);
        let linkFile = null;
        let extenxion = null;

        if (isAFile) {
            const blob = new Blob([file]);
            linkFile = URL.createObjectURL(blob);
            extenxion = file.type;
        } else {
            extenxion = accept !== undefined ? TYPES_FILE.png : file.split("-.")[1];
        }
        const link = linkFile ?? file;
        return { link, extenxion, isAFile };
    };

    const fileList = imagesList.concat(linkList);

    return (
        <div className="overflow-hidden rounded-12">
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleOnDrop}
                className="my-1 h-70 w-full overflow-y-scroll rounded-12 border-0.5 border-gray-100">
                {fileList.length === 0 ? (
                    <div className="grid h-full w-full place-content-center">
                        <div className="flex flex-col items-center ">
                            <IconArchiveFile width={75} height={75} />
                            <h4 className="mb-3 w-48 text-center text-15 font-bold leading-6 text-gray-400 ">{principalText}</h4>
                            <button
                                disabled={isDisable}
                                onClick={handleOpenSearchFile}
                                type={"button"}
                                className="button-gradient-xl w-auto whitespace-nowrap disabled:cursor-not-allowed">
                                {t("shop.modal.findFile")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        className="grid h-full w-full grid-flow-row gap-4 p-2"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minMax(8rem, 1fr))" }}>
                        {/* This "file" maybe to be a file (binary) or a link of s3 */}
                        {fileList.map((file) => {
                            const { link, extenxion, isAFile } = parseFile(file);
                            const mediaUrl = file[searchLinkKey] ?? link;
                            const IconOrImgFile = renderImg({ type: extenxion, link, classImg: "w-32 h-28", fillIcon: "#fff" });
                            const isLoadingThisFile = Boolean(uploadFileLoading[file?.name]);
                            const isLoadingDeleteFile = Boolean(deleteFileLoading[mediaUrl ?? link]);

                            return (
                                <div key={link} className="divParent relative grid h-32 place-content-center rounded-20 bg-primary-700 bg-opacity-75">
                                    {!isLoadingThisFile && (
                                        <>
                                            <button
                                                disabled={isLoadingDeleteFile || isDisable}
                                                type={"button"}
                                                onClick={(evt) => {
                                                    evt.stopPropagation();
                                                    evt.preventDefault();
                                                    handleDeleteImage({ mediaUrl });
                                                }}
                                                className="absolute right-1.5 top-1.5 z-20 hidden disabled:cursor-not-allowed disabled:opacity-60">
                                                <CloseIcon className="fill-current text-gray-75" width="0.5rem" height="0.5rem" />
                                            </button>
                                            {isAFile && (
                                                <div className="absolute top-4 z-20 hidden w-full bg-white bg-opacity-65 px-1">
                                                    <p title={file.name} className="truncate font-medium">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-center">{Number(file.size / unitInMB).toFixed(2)} MB</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {(isLoadingThisFile || isLoadingDeleteFile) && (
                                        <div className="absolute top-5 right-70 z-20">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                    <picture className={isLoadingThisFile ? "blur-sm" : ""}>
                                        <IconOrImgFile />
                                    </picture>
                                </div>
                            );
                        })}
                        <div className="grid h-32 place-content-center rounded-20">
                            <button
                                disabled={isDisable}
                                onClick={handleOpenSearchFile}
                                className="font-back select-none text-5xl text-primary-200 disabled:cursor-not-allowed disabled:opacity-60">
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <input accept={accept} ref={inputFileRf} type={"file"} hidden multiple onChange={handleSelectFiles} />
        </div>
    );
}
export default DropZoneFiles;
