import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { useGetFileUrl } from "../../services/brainAPI";
import { ALLOWED_EXTENSIONS } from "../../constants";
import FileDropUploader from "./fileDropUploader";
import FileUploadStatus from "./fileUploadStatus";

const FileComponent = ({ setDatasourceValues, datasourceValues }) => {
    const company = useSelector((state) => state.company);
    const [showFileDropComponent, setShowFileDropComponent] = useState(true);
    const [isError, setIsError] = useState(false);
    const [file, setFile] = useState({});
    const [fileInfo, setFileInfo] = useState({});
    const [displayWarningColor, setDisplayWarningColor] = useState(false);
    const { id: companyId } = company;

    const { mutateAsync, isLoading } = useGetFileUrl({ file, companyId });

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
        if (fileInfo.type === ALLOWED_EXTENSIONS.PDF && fileInfo.size <= 5) {
            try {
                const fileUrl = await mutateAsync();
                setDatasourceValues((prevValues) => ({
                    ...prevValues,
                    metadata: {
                        files: [fileUrl],
                    },
                }));
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
        setDatasourceValues((prevValues) => ({
            ...prevValues,
            metadata: {
                files: [],
            },
        }));
        setShowFileDropComponent(true);
        setDisplayWarningColor(false);
        setIsError(false);
    };

    useEffect(() => {
        if (datasourceValues?.metadata) delete datasourceValues.metadata;
    }, []);

    useEffect(() => {
        if (!isEmpty(fileInfo)) {
            uploadFile();
        }
    }, [fileInfo]);

    return (
        <div>
            {showFileDropComponent ? (
                <FileDropUploader isLoading={isLoading} handleFile={handleFile} fileType={ALLOWED_EXTENSIONS.PDF} displayWarningColor={displayWarningColor} />
            ) : (
                <FileUploadStatus fileName={fileInfo.name} fileSize={fileInfo.size} handleResetFile={handleResetFile} isError={isError} />
            )}
        </div>
    );
};

export default FileComponent;
