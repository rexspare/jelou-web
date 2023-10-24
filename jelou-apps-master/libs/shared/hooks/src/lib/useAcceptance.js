import { CHANNELS_VIDEO_SUPORT } from "@apps/shared/constants";
import get from "lodash/get";
import toUpper from "lodash/toUpper";
import { useSelector } from "react-redux";

export function useAcceptance() {
    const currentRoom = useSelector((state) => state.currentRoom);

    const documentAcceptance = () => {
        const source = get(currentRoom, "source", "");
        switch (toUpper(source)) {
            case "FACEBOOK":
                return "application/pdf";
            case "WAVY":
                return "application/pdf";
            case "TWILIO":
                return "application/pdf";
            default:
                return ".xls,xlsx,.doc,.docx,.ppt,.pptx,.pdf,.vnd.ms-excel,application/.vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/.vnd.openxmlformats-officedocument.wordprocessingml.document,vnd.openxmlformats-officedocument.presentationml.presentation";
        }
    };

    const imageAcceptance = () => {
        const source = get(currentRoom, "source", "");
        switch (toUpper(source)) {
            case "TWILIO":
                return "image/jpg,image/png";
            default:
                return "image/jpg,image/jpeg,image/png,.png,.jpg,.jpeg";
        }
    };

    const videoAcceptance = () => {
        const channel = get(currentRoom, "channel", "");
        const isVideoSuportChannel = CHANNELS_VIDEO_SUPORT[String(channel).toUpperCase()];

        return isVideoSuportChannel
            ? "video/mp4,video/3gpp,video/mov,video/m4v,video/webm,video/quicktime,video/mpeg,video/H261,video/H263,video/H263-2000,video/H264,.mov,.m4v,mp4,quicktime,m4v"
            : "";
    };

    return { videoAcceptance, imageAcceptance, documentAcceptance };
}
