import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import {
    Audio,
    ButtonBlock,
    ContactBlock,
    FileBlock,
    ImageBlock,
    LocationBlock,
    QuickReplyBlock,
    StickerBlock,
    TextBlock,
    TextListBlock,
    VideoBlock,
} from "@builder/modules/Nodes/message/domain/message.domain";
import { BUTTONS_OPTIONS_TYPES } from "@builder/modules/Nodes/message/domain/quickReplay";

export function generateTextBlock(defaultId: string): TextBlock {
    return {
        id: defaultId,
        type: BLOCK_TYPES.TEXT,
        text: "",
    };
}

export function generateTextBlockDefaultDnD(defaultId: string) {
    return [generateTextBlock(defaultId)];
}

export function generateImageBlock(defaultId: string): ImageBlock {
    return {
        id: defaultId,
        type: BLOCK_TYPES.IMAGE,
        url: "",
        caption: "",
    };
}

export function generateImageBlockDefaultDnD(defaultId: string) {
    return [generateImageBlock(defaultId)];
}

export function generateVideoBlock(defaultId: string): VideoBlock {
    return {
        id: defaultId,
        type: BLOCK_TYPES.VIDEO,
        url: "",
        caption: "",
    };
}

export function generateVideoBlockDefaultDnD(defaultId: string) {
    return [generateVideoBlock(defaultId)];
}

export function generateStickerBlock(defaultId: string): StickerBlock {
    return {
        id: defaultId,
        type: BLOCK_TYPES.STICKER,
        url: "",
        caption: "",
    };
}

export function generateStickerBlockDefaultDnD(defaultId: string) {
    return [generateStickerBlock(defaultId)];
}

export function generateFileBlock(defaultId: string): FileBlock {
    return {
        id: defaultId,
        type: BLOCK_TYPES.FILE,
        name: "",
        url: "",
    };
}

export function generateFileBlockDefaultDnD(defaultId: string) {
    return [generateFileBlock(defaultId)];
}

export function generateContactBlock(defaultId: string): ContactBlock {
    return {
        id: defaultId,
        type: BLOCK_TYPES.CONTACT,
        contacts: [
            {
                name: {
                    first_name: "",
                    formatted_name: "",
                    last_name: "",
                },
                org: {
                    company: "",
                    department: "",
                    title: "",
                },
            },
        ],
    };
}

export function generateContactBlockDefaultDnD(defaultId: string) {
    return [generateContactBlock(defaultId)];
}

export function generateTextListBlock(defaultId: string): TextListBlock {
    return {
        id: defaultId,
        type: BLOCK_TYPES.LIST,
        text: "",
        title: "",
        button: "",
        options: [
            {
                id: defaultId,
                title: "",
                type: BUTTONS_OPTIONS_TYPES.POSTBACK,
                payload: {
                    type: "edge",
                    targetId: null,
                },
                url: "",
                description: "",
            },
        ],
    };
}

export const generateButtonBlockWithTextDnD = (defaultId: string) => {
    return [generateTextListBlock(defaultId)];
};

export function generateQuickRepliesBlock(defaultId: string): QuickReplyBlock {
    return {
        id: defaultId,
        type: BLOCK_TYPES.QUICK_REPLY,
        text: "",
        options: [
            {
                id: defaultId,
                title: "",
                type: BUTTONS_OPTIONS_TYPES.POSTBACK,
                payload: {
                    type: "edge",
                    targetId: null,
                },
                url: "",
                description: "",
            },
        ],
    };
}

export function generateButtonsBlock(defaultId: string): ButtonBlock {
    return {
        id: defaultId,
        type: BLOCK_TYPES.BUTTONS,
        text: "",
        caption: "",
        title: "",
        options: [
            {
                id: defaultId,
                type: BUTTONS_OPTIONS_TYPES.POSTBACK,
                title: "",
                description: "",
                payload: {
                    type: "edge",
                    targetId: null,
                },
                url: "",
            },
        ],
        settings: {
            oneTimeUseButtons: false,
            type: undefined,
            redirectPayload: undefined,
        },
    };
}

export function generateButtonsBlockDnD(defaultId: string) {
    return [generateButtonsBlock(defaultId)];
}

export function generateQuickRepliesBlockDnD(defaultId: string) {
    return [generateQuickRepliesBlock(defaultId)];
}

export const generateLocationBlock = (defaultId: string): LocationBlock => {
    return {
        id: defaultId,
        address: "",
        coordinates: {
            latitude: "",
            longitude: "",
        },
        name: "",
        type: BLOCK_TYPES.LOCATION,
    };
};

export const generateLocationBlockDnD = (defaultId: string) => {
    return [generateLocationBlock(defaultId)];
};

export const generateAudioBlock = (defaultId: string): Audio => {
    return {
        id: defaultId,
        type: BLOCK_TYPES.AUDIO,
        url: "",
    };
};

export const generateAudioBlockDnD = (defaultId: string) => {
    return [generateAudioBlock(defaultId)];
};
