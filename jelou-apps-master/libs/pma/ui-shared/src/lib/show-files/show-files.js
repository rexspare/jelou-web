import { FileIcon } from "react-file-icon";
import toUpper from "lodash/toUpper";
import get from "lodash/get";

const ShowFiles = (props) => {
    const { attachments, setAttachments } = props;
    const canEdit = get(props, "canEdit", false);

    const truncate = (n, len) => {
        const ext = n.substring(n.lastIndexOf(".") + 1, n.length).toLowerCase();
        let filename = n.replace("." + ext, "");
        filename = filename.substr(0, len) + (n.length > len ? `[...].${ext}` : "");
        return filename;
    };

    const getExtension = (mediaName) => {
        try {
            return mediaName.match(/\.[0-9a-z]+$/i)[0].replace(".", "");
        } catch (error) {
            return "Unknown";
        }
    };

    const setLabelColor = (type) => {
        switch (toUpper(type)) {
            case "PDF":
                return "#F15642";
            case "DOC":
                return "#2A8BF2";
            case "DOCX":
                return "#2A8BF2";
            case "PPT":
                return "#D14423";
            case "PPTX":
                return "#D14423";
            case "XLS":
                return "#1A754C";
            case "XLSX":
                return "#1A754C";
            case "CSV":
                return "#1A754C";
            case "PHP":
                return "#8892BE";
            default:
                return "#F15642";
        }
    };

    const setType = (type) => {
        switch (toUpper(type)) {
            case "PDF":
                return "acrobat";
            case "DOC":
            case "DOCX":
                return "document";
            case "PPT":
            case "PPTX":
                return "presentation";
            case "XLS":
            case "XLSX":
            case "CSV":
                return "spreadsheet";
            case "DMG":
                return "drive";
            case "HTML":
            case "HTM":
            case "PHP":
            case "YML":
                return "code";
            case "RAR":
            case "ZIP":
                return "compressed";
            case "SVG":
                return "vector";
            case "PNG":
            case "JPG":
            case "JPEG":
                return "image";
            default:
                return "acrobat";
        }
    };

    const deleteFromArray = (index) => {
        const att = [...attachments];
        att.splice(index, 1);
        setAttachments(att);
    };

    return (
        <div className="max-h-48 mx-2 flex overflow-y-auto" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <div className="grid grid-cols-3 items-center gap-4">
                {attachments.map((att, index) => {
                    if (canEdit) {
                        return (
                            <div className="flex-1" key={index}>
                                <div className="relative flex h-auto w-auto rounded-md border-default !border-gray-400/75 py-4 pl-3 pr-1 hover:border-gray-300">
                                    <button
                                        className="flex w-full items-center focus:outline-none"
                                        onClick={() => {
                                            window.open(att.url, "_blank");
                                        }}>
                                        <div className="flex w-[3rem]">
                                            <FileIcon
                                                color={"#E2E5E7"}
                                                labelTextColor={"white"}
                                                size={45}
                                                labelColor={setLabelColor(toUpper(getExtension(att.fileName)))}
                                                foldColor="#B0B7BD"
                                                type={setType(toUpper(getExtension(att.fileName)))}
                                                labelUppercase
                                                extension={getExtension(att.fileName)}
                                            />
                                        </div>
                                        <div className="flex truncate break-words">
                                            <span className="max-w-full whitespace-pre-wrap break-words px-5 text-left text-15">
                                                {truncate(get(att, "fileName", get(att, "file_name", "")), 30)}
                                            </span>
                                        </div>
                                    </button>
                                    {canEdit && (
                                        <button
                                            className="absolute right-0 top-0 mt-1 mr-1 flex cursor-pointer rounded-full text-xs font-bold text-gray-400 focus:outline-none"
                                            onClick={() => deleteFromArray(index)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                        // }
                    } else {
                        // if (notImage(get(att, "fileName", get(att, "file_name", "")))) {
                        return (
                            <div className="flex-1" key={index}>
                                <div className="relative flex h-auto w-auto rounded-md border-default !border-gray-100 !border-opacity-20 py-4 pl-3 pr-1 hover:border-gray-300">
                                    <button
                                        className="flex w-full items-center focus:outline-none"
                                        onClick={() => {
                                            window.open(att.url, "_blank");
                                        }}>
                                        <div className="flex w-[3rem]">
                                            <FileIcon
                                                color={"#E2E5E7"}
                                                labelTextColor={"white"}
                                                size={45}
                                                labelColor={setLabelColor(toUpper(getExtension(att.fileName)))}
                                                foldColor="#B0B7BD"
                                                type={setType(toUpper(getExtension(att.fileName)))}
                                                labelUppercase
                                                extension={getExtension(att.fileName)}
                                            />
                                        </div>
                                        <div className="flex truncate break-words">
                                            <span className="max-w-full whitespace-pre-wrap break-words px-5 text-left text-15">
                                                {truncate(get(att, "fileName", get(att, "file_name", "")), 30)}
                                            </span>
                                        </div>
                                    </button>
                                    {canEdit && (
                                        <button
                                            className="absolute right-0 top-0 mt-1 mr-1 flex cursor-pointer rounded-full text-xs font-bold text-gray-400 focus:outline-none"
                                            onClick={() => deleteFromArray(index)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                        // }
                    }
                })}
            </div>
        </div>
    );
};
export default ShowFiles;
