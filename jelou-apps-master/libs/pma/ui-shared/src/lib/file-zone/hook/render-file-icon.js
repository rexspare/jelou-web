import { ExcelFileIcon, PDFFileIcon, PowerPointFileIcon, RandomFileIcon, WordFileIcon, ZipFilIcon } from "@apps/shared/icons";
import { TYPES_FILE } from "@apps/shared/constants";

export default function useRenderFileIcon() {
    const renderImg = ({ type, link, size = "90", classImg = "h-11 w-10", fillIcon = "#f5f5f5", activateControlsVideos = false } = {}) => {
        switch (type) {
            case TYPES_FILE.jpeg:
            case TYPES_FILE.jpg:
            case TYPES_FILE.png: {
                return () => <img src={link} alt={type} className={`rounded-md object-cover ${classImg}`} />;
            }

            case TYPES_FILE.video3gp:
            case TYPES_FILE.videoQui:
            case TYPES_FILE.video: {
                return () => <video src={link} controls={activateControlsVideos} className={`rounded-md object-cover ${classImg}`} />;
            }

            case TYPES_FILE.excel:
            case TYPES_FILE.xls:
            case TYPES_FILE.xlsx:
            case TYPES_FILE.xlsx1:
                return () => <ExcelFileIcon width={size} height={size} fill={fillIcon} />;

            case TYPES_FILE.pdf:
                return () => <PDFFileIcon width={size} height={size} fill={fillIcon} />;

            case TYPES_FILE.word:
            case TYPES_FILE.docx:
                return () => <WordFileIcon width={size} height={size} fill={fillIcon} />;

            case TYPES_FILE.zip:
                return () => <ZipFilIcon width={size} height={size} fill={fillIcon} />;

            case TYPES_FILE.powerPoint:
            case TYPES_FILE.powerPoint1:
            case TYPES_FILE.pptx:
                return () => <PowerPointFileIcon width={size} height={size} fill={fillIcon} />;

            default:
                return () => <RandomFileIcon width={size} height={size} fill={fillIcon} />;
        }
    };

    return { renderImg };
}
