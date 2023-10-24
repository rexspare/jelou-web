import FileDropUploader from "../../../../Modal/fileComponent/fileDropUploader";
import FileUploadStatus from "../../../../Modal/fileComponent/fileUploadStatus";
import { ALLOWED_EXTENSIONS } from "../../../../constants";
import { useGetFileUrl } from "../../../../services/brainAPI";
import { first, get, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ImageFileDrop = (props) => {
    const { url = "", saveImage } = props;
    const company = useSelector((state) => state.company);
    const [showFileDropComponent, setShowFileDropComponent] = useState(true);
    const [isError, setIsError] = useState(false);
    const [file, setFile] = useState({});
    const [fileInfo, setFileInfo] = useState({});
    const [displayWarningColor, setDisplayWarningColor] = useState(false);
    const { id: companyId } = company;

    const { mutateAsync, isLoading } = useGetFileUrl({ file, companyId });

    useEffect(() => {
        if (!isEmpty(url)) setShowFileDropComponent(false);
    }, [url]);

    const handleFile = (e) => {
        const files = get(e, "target.files");
        const file = first(files);
        const type = file?.type.replace("application/", ".");
        const size = Number((file?.size / 1048576).toFixed(2));
        const name = file?.name;
        setFile(file);
        setFileInfo({ name, type, size });
    };

    const uploadFile = async () => {
        if (fileInfo.type === ALLOWED_EXTENSIONS.PDF || (ALLOWED_EXTENSIONS.IMAGE.includes(fileInfo.type) && fileInfo.size <= 5)) {
            try {
                const fileUrl = await mutateAsync();
                // setImagelogo
                saveImage(fileUrl);
            } catch (error) {
                setIsError(true);
            }
            setShowFileDropComponent(false);
        } else {
            setDisplayWarningColor(true);
        }
    };

    const handleResetFile = () => {
        setFileInfo({});
        setShowFileDropComponent(true);
        setDisplayWarningColor(false);
        setIsError(false);
    };

    useEffect(() => {
        if (!isEmpty(fileInfo)) {
            uploadFile();
        }
    }, [fileInfo]);

    return (
        <div>
            {showFileDropComponent ? (
                <FileDropUploader isLoading={isLoading} handleFile={handleFile} fileType={ALLOWED_EXTENSIONS.IMAGE} displayWarningColor={displayWarningColor} flexRow={true} isImage={true} />
            ) : (
                <FileUploadStatus fileName={fileInfo.name} fileSize={fileInfo.size} handleResetFile={handleResetFile} isError={isError} isImage={true} url={url} />
            )}
        </div>
    );
};

export default ImageFileDrop;
