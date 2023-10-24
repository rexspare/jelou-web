import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DropZoneFiles, renderMessage } from "@apps/shared/common";
import { useUploadFile } from "../Hooks/uploadFile";
import { MESSAGE_TYPES } from "@apps/shared/constants";

function FileInput({
    databaseSlug = "",
    handleChangeDataForm,
    linkList = [],
    name: nameOfColumn,
    setDisableButtonCreateData = () => null,
    type,
    isDisable,
} = {}) {
    const [existImg, setExistImg] = useState(linkList);
    const { prepareFile: uploadFile, deleteFile } = useUploadFile({ databaseSlug });
    const { t } = useTranslation();

    useEffect(() => {
        if (linkList.length === 0) return;
        handleChangeDataForm({ value: linkList, name: nameOfColumn, type: type + "url" });
    }, []);

    const handleAddFile = useCallback(
        (file) => {
            return uploadFile({ file })
                .then((url) => {
                    handleChangeDataForm({ value: url, name: nameOfColumn, type });
                    return url;
                })
                .catch((err) => {
                    renderMessage(err, MESSAGE_TYPES.ERROR);
                    throw err;
                });
        },
        [uploadFile]
    );

    const handleRemoveFile = useCallback((urlFile) => {
        if (urlFile === null) {
            console.error("url file is null", { urlFile });
            return Promise.reject("No se puede eliminar el archivo");
        }
        return deleteFile({ urlFile })
            .then(() => {
                handleChangeDataForm({ value: urlFile, name: nameOfColumn, type: type + "remove" });
                setExistImg((preState) => preState.filter((url) => url !== urlFile));
                return true;
            })
            .catch(() => {
                renderMessage(t("datum.error.deleteFile"), MESSAGE_TYPES.ERROR);
                return false;
            });
    }, []);

    return (
        <DropZoneFiles
            principalText={`${t("datum.dragNdrop1")} ${t("datum.dragNdrop2")}`}
            isDisable={isDisable}
            handleChangeDataForm={handleChangeDataForm}
            name={nameOfColumn}
            linkList={existImg}
            type={type}
            setDisableButtonCreateData={setDisableButtonCreateData}
            handleAddFile={handleAddFile}
            handleRemoveFile={handleRemoveFile}
        />
    );
}

export default memo(FileInput);
