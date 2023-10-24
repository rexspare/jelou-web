import get from "lodash/get";
import { Node } from "reactflow";

import { EmptyFileIcon, EmptyColorFileIcon, EmptyColorPictureIcon, VideoEmbeddedIconColor, EmptyPictureIcon, MultiMP3Icon, StickerIcon, VideoEmbeddedIcon } from "@builder/Icons";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { LabelBtnAudioConfig, LabelBtnImagenConfig, LabelBtnStickerConfig, LabelBtnVideoConfig } from "../configPanel/LabelsBtnsConfig";
import { AUDIO_FILES, FILE_FILES, IMAGE_FILES, STICKER_FILES, VIDEO_FILES } from "./Image/RenderImg/constants.renderImg";

/**
 * This function checks if a node has more than one location block and renders a warning message if it does.
 * @param {Node} currentNode - The `currentNode` parameter is an object that represents a node in a data
 * structure. It is used as input to the `onlyOneLocationBlockForNode` function.
 * @returns a boolean value, which indicates whether the given `currentNode` has a location block or
 * not. If the `messages` array of the `currentNode` contains at least one message with type
 * `BLOCK_TYPES.LOCATION`, then the function returns `true`, otherwise it returns `false`.
 * Additionally, if the `hasLocationBlock` variable is `true`, the function also calls
 */
export const onlyOneLocationBlockForNode = (currentNode: Node<MessageNode>) => {
    const messages = get(currentNode, "data.configuration.messages", []);
    const hasLocationBlock = messages.some((message) => message?.type === BLOCK_TYPES.LOCATION);

    if (hasLocationBlock) {
        renderMessage("Solo se puede agregar un bloque de ubicación", TYPE_ERRORS.WARNING);
    }

    return hasLocationBlock;
};

export const getEmptyIcon = (type: BLOCK_TYPES) => {
    switch (type) {
        case BLOCK_TYPES.IMAGE:
            return <EmptyPictureIcon />;
        case BLOCK_TYPES.VIDEO:
            return <VideoEmbeddedIcon />;
        case BLOCK_TYPES.FILE:
            return <EmptyFileIcon />;
        case BLOCK_TYPES.STICKER:
            return <StickerIcon />;
        case BLOCK_TYPES.AUDIO:
            return <MultiMP3Icon />;
        default:
            return null;
    }
};

export const getEmptyIconColor = (type: BLOCK_TYPES) => {
  switch (type) {
      case BLOCK_TYPES.IMAGE:
          return <EmptyColorPictureIcon width={64} height={64} />;
      case BLOCK_TYPES.VIDEO:
          return <VideoEmbeddedIconColor width={64} height={64} />;
      case BLOCK_TYPES.FILE:
          return <EmptyColorFileIcon width={64} height={64} />;
      case BLOCK_TYPES.STICKER:
          return <StickerIcon width={64} height={64} />;
      case BLOCK_TYPES.AUDIO:
          return <MultiMP3Icon width={64} height={64} />;
      default:
          return null;
  }
};

export const getMediaText = (type: BLOCK_TYPES) => {
    switch (type) {
        case BLOCK_TYPES.IMAGE:
            return "Agregar imagen";
        case BLOCK_TYPES.VIDEO:
            return "Agregar video";
        case BLOCK_TYPES.FILE:
            return "Agregar documento";
        case BLOCK_TYPES.STICKER:
            return "Agregar sticker";
        case BLOCK_TYPES.AUDIO:
            return "Agregar audio";
        default:
            return null;
    }
};

export const getSupportedFiles = (type: BLOCK_TYPES) => {
    switch (type) {
        case BLOCK_TYPES.IMAGE:
            return IMAGE_FILES;
        case BLOCK_TYPES.VIDEO:
            return VIDEO_FILES;
        case BLOCK_TYPES.FILE:
            return FILE_FILES;
        case BLOCK_TYPES.STICKER:
            return STICKER_FILES;
        case BLOCK_TYPES.AUDIO:
            return AUDIO_FILES;
        default:
            return [];
    }
};

/**
 * Returns the label of the button to open the configuration panel
 * @param {string} type - The type of the block
 */
export const getConfigLabel = (type: BLOCK_TYPES) => {
    switch (type) {
        case BLOCK_TYPES.IMAGE:
            return <LabelBtnImagenConfig />;
        case BLOCK_TYPES.VIDEO:
            return <LabelBtnVideoConfig />;
        case BLOCK_TYPES.STICKER:
            return <LabelBtnStickerConfig />;
        case BLOCK_TYPES.AUDIO:
            return <LabelBtnAudioConfig />;
        default:
            return null;
    }
};
