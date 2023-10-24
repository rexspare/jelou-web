import { renderMessage } from "@apps/shared/common";
import { DOCUMENT_MESSAGE_TYPES, MESSAGE_TYPES } from "@apps/shared/constants";
import { useAcceptance, useUploadFile } from "@apps/shared/hooks";
import { debounce } from "lodash";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { validateFile } from "../utils";

export default function useHandlesDropzone({ setUploading, setDocumentList, setShowDropzone }) {
    const { t } = useTranslation();
    const { prepareAndUploadFile, deleteFile } = useUploadFile();
    const { documentAcceptance, imageAcceptance, videoAcceptance } = useAcceptance();
    const currentRoom = useSelector((state) => state.currentRoom);

    const ACCEPTED = {
        image: { type: DOCUMENT_MESSAGE_TYPES.image, accept: imageAcceptance() },
        video: { type: DOCUMENT_MESSAGE_TYPES.video, accept: videoAcceptance() },
        document: { type: DOCUMENT_MESSAGE_TYPES.document, accept: documentAcceptance() },
    };

    const addFileToList = useCallback(
        ({ file = null, documentList = [] } = {}) => {
            if (!file) return;

            const { hasError } = validateFile({ documentList, file, t, ACCEPTED, currentRoom });
            if (hasError) return;

            const blob = new Blob([file]);
            const link = URL.createObjectURL(blob);

            const newDoc = {
                name: file.name,
                size: file.size,
                type: file.type,
                link,
            };

            setUploading((preState) => ({ ...preState, [link]: true }));
            setDocumentList((preState) => [...preState, newDoc]);

            prepareAndUploadFile(file).then(({ mediaUrl }) => {
                setDocumentList((preState) => {
                    return preState.map((doc) => {
                        if (doc.link === link) {
                            return { ...doc, mediaUrl };
                        }
                        return doc;
                    });
                });

                setUploading((preState) => ({ ...preState, [link]: false }));
            });
        },
        [currentRoom]
    );

    const handleDragEnter = useCallback(
        debounce(
            (evt) => {
                evt.stopPropagation();
                evt.preventDefault();
                setShowDropzone(true);
            },
            100,
            { leading: true, trailing: false }
        ),
        []
    );

    const handleDragLeave = useCallback(
        debounce(
            (evt) => {
                evt.stopPropagation();
                evt.preventDefault();

                if (evt.target.id === "dropzoneLeave") {
                    setShowDropzone(false);
                }
            },
            100,
            { leading: false, trailing: true }
        ),
        []
    );

    const handleDeleteImage = useCallback(({ mediaUrl = null, link, currentRoom } = {}) => {
        if (!mediaUrl) {
            renderMessage(t("pma.deleteFile"), MESSAGE_TYPES.ERROR);
            console.log("Error eliminando archivo", { mediaUrl });
            return;
        }

        setUploading((preState) => ({ ...preState, [link]: true }));

        deleteFile({ mediaUrl, currentRoom })
            .then((messageRes) => {
                setDocumentList((preState) => preState.filter((doc) => doc.link !== link));
                renderMessage(messageRes, MESSAGE_TYPES.SUCCESS);
            })
            .catch((err) => {
                console.log("Error eliminando archivo", { err });
                renderMessage(t("pma.deleteFile"), MESSAGE_TYPES.ERROR);
            })
            .finally(() => setUploading((preState) => ({ ...preState, [link]: false })));
    }, []);

    const handleOnDrop = useCallback(({ evt, documentList = [] } = {}) => {
        evt.stopPropagation();
        evt.preventDefault();

        const { files = [] } = evt.dataTransfer;

        [...files].forEach((file) => {
            addFileToList({ file, documentList });
        });

        setShowDropzone(false);
    }, []);

    const handleSelectFiles = useCallback(
        ({ evt, documentList = [] } = {}) => {
            evt.preventDefault();
            const files = evt.target.files;
            Object.values(files).forEach((file) => {
                addFileToList({ file, documentList });
            });
        },
        [addFileToList]
    );

    const handleAddFiles = useCallback(({ files = [], documentList = [] } = {}) => {
        [...files].forEach((file) => {
            addFileToList({ file, documentList });
        });
        console.log(files, "files");
    }, []);

    return {
        handleAddFiles,
        handleDeleteImage,
        handleDragEnter,
        handleDragLeave,
        handleOnDrop,
        handleSelectFiles,
    };
}
