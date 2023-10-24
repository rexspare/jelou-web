import { ExcelFileIcon, PDFFileIcon, PowerPointFileIcon, RandomFileIcon, WordFileIcon, ZipFilIcon } from "../../../../../Icons/Docs.Icons";
import { AudioRender } from "./AudioRender";
import { TYPES_FILE } from "./constants.renderImg";

export const renderFile = ({ type, link, size = "90", classImg = "h-11 w-10", fillIcon = "#f5f5f5", showPlayer = false } = {}) => {
  switch (type) {
    case TYPES_FILE.IMAGE_WEBP:
    case TYPES_FILE.IMAGE_JPEG:
    case TYPES_FILE.IMAGE_JPG:
    case TYPES_FILE.IMAGE_PNG:
    case TYPES_FILE.jpeg:
    case TYPES_FILE.webp:
    case TYPES_FILE.jpg:
    case TYPES_FILE.png: {
      return () => <img src={link} alt={type} className={`object-cover ${classImg}`} />;
    }

    case TYPES_FILE.VIDEO_MP4:
    case TYPES_FILE.video3gp:
    case TYPES_FILE.videoQui:
    case TYPES_FILE.video: {
      return () => <video controls src={link} className={`object-cover ${classImg}`} />;
    }

    case TYPES_FILE.AUDIO_MP3:
    case TYPES_FILE.AUDIO:
    case TYPES_FILE.AUDIO2:
    case TYPES_FILE.AUDIO_MPEG: {
      return () => <AudioRender link={link} showPlayer={showPlayer} />;
    }

    case TYPES_FILE.excel:
    case TYPES_FILE.xls:
    case TYPES_FILE.xlsx:
    case TYPES_FILE.xlsx1:
    case TYPES_FILE.APPLICATION_XLS:
    case TYPES_FILE.APPLICATION_XLSX: {
      return () => <ExcelFileIcon width={size} height={size} fill={fillIcon} />;
    }

    case TYPES_FILE.pdf:
    case TYPES_FILE.APPLICATION_PDF: {
      return () => <PDFFileIcon width={size} height={size} fill={fillIcon} />;
    }

    case TYPES_FILE.word:
    case TYPES_FILE.docx:
    case TYPES_FILE.APPLICATION_DOCX:
      return () => <WordFileIcon width={size} height={size} fill={fillIcon} />;

    case TYPES_FILE.zip:
    case TYPES_FILE.APPLICATION_ZIP:
      return () => <ZipFilIcon width={size} height={size} fill={fillIcon} />;

    case TYPES_FILE.powerPoint:
    case TYPES_FILE.powerPoint1:
    case TYPES_FILE.pptx:
    case TYPES_FILE.APPLICATION_PPTX:
      return () => <PowerPointFileIcon width={size} height={size} fill={fillIcon} />;

    default:
      return () => <RandomFileIcon width={size} height={size} fill={fillIcon} />;
  }
};
