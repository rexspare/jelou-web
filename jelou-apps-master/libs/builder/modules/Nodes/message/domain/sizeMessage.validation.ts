import z from "zod";

import { currentChannelStore } from "@builder/Stores/currentchannel";
import { BLOCK_TYPES } from "./constants.message";
import { ButtonOption } from "./quickReplay";

// Validations for message text

export const MAX_LENGTH_TEXT_MESSAGE_BY_CHANNEL = {
    WHATSAPP: 4096,
    FACEBOOK: 2000,
    INSTAGRAM: 2000,
    WEB: 4096,
    OMNICHANNEL: 2000,
};

// Validations for media caption text
export const MAX_LENGTH_CAPTION_MEDIA_BY_CHANNEL = {
    WHATSAPP: 1024,
    FACEBOOK: 0,
    INSTAGRAM: 0,
    WEB: 1024,
    OMNICHANNEL: 1024,
};

// Validations for file text
export const MAX_LENGTH_FILE_BY_CHANNEL = {
    WHATSAPP: 47,
    FACEBOOK: 255,
    INSTAGRAM: 255,
    WEB: 255,
    OMNICHANNEL: 47,
};

// Validations for buttons body text
const MAX_LENGTH_BUTTONS_BODY_TEXT_BY_CHANNEL = {
    WHATSAPP: 1024,
    FACEBOOK: 640,
    INSTAGRAM: 640,
    WEB: 1024,
    OMNICHANNEL: 640,
};

const MAX_LENGTH_LIST_OPTION_NAME = 24;
const MAX_LENGTH_BUTTON_OPTION_NAME = 20;

export function getMaxLengthByBlockType(blockType: OptionsTypesMessages) {
    const types = {
        [BLOCK_TYPES.LIST]: MAX_LENGTH_LIST_OPTION_NAME,
        [BLOCK_TYPES.QUICK_REPLY]: MAX_LENGTH_BUTTON_OPTION_NAME,
        [BLOCK_TYPES.BUTTONS]: MAX_LENGTH_BUTTON_OPTION_NAME,
    };

    return types[blockType];
}

export const MAX_LENGTH_QUICK_BODY_TEXT_BY_CHANNEL = 2000;
export const MAX_LENGTH_HEADER_QUICK_REPLY = 60;
export const MAX_LENGTH_CAPTION_QUICK_REPLY = 60;

type ValidationResult = {
    message: string | undefined;
};

export function getButtonsBodyMaxLength() {
    const currentTypeChannel = currentChannelStore.getState().currentTypeChannel;
    return MAX_LENGTH_BUTTONS_BODY_TEXT_BY_CHANNEL[currentTypeChannel];
}

export function getFileNameMaxLenght() {
    const currentTypeChannel = currentChannelStore.getState().currentTypeChannel;
    return MAX_LENGTH_FILE_BY_CHANNEL[currentTypeChannel];
}

export function getBodyMessageMaxLength() {
    const currentTypeChannel = currentChannelStore.getState().currentTypeChannel;
    return MAX_LENGTH_TEXT_MESSAGE_BY_CHANNEL[currentTypeChannel];
}

export function getCaptionMediaMaxLenght() {
    const currentTypeChannel = currentChannelStore.getState().currentTypeChannel;
    return MAX_LENGTH_CAPTION_MEDIA_BY_CHANNEL[currentTypeChannel];
}

export function validateMessageText(text: string): ValidationResult {
    const currentTypeChannel = currentChannelStore.getState().currentTypeChannel;
    const maxLength = MAX_LENGTH_TEXT_MESSAGE_BY_CHANNEL[currentTypeChannel];

    const schema = z.object({
        text: z.string().max(maxLength, `El mensaje no puede superar los ${maxLength} caracteres.`),
    });

    const result = schema.safeParse({ text });

    return {
        message: result.success ? undefined : result.error.errors[0].message,
    };
}

// Validations for list text message (quick reply, list block, buttons)
export type OptionsTypesMessages = BLOCK_TYPES.QUICK_REPLY | BLOCK_TYPES.LIST | BLOCK_TYPES.BUTTONS;

export const maxLength = 1024;

export function validationListTextMessage(text: string) {
    const schema = z.object({
        text: z.string().max(maxLength, `El mensaje no puede superar los ${maxLength} caracteres.`),
    });

    const result = schema.safeParse({ text });

    return {
        message: result.success ? undefined : result.error.errors[0].message,
    };
}

// Validations max options for list block, quick reply and buttons

export const MAX_OPTIONS_BY_TYPE = {
    [BLOCK_TYPES.QUICK_REPLY]: 13,
    [BLOCK_TYPES.LIST]: 10,
    [BLOCK_TYPES.BUTTONS]: 3,
};

const MAX_OPTIONS_BY_CHANNEL = {
    WHATSAPP: {
        [BLOCK_TYPES.QUICK_REPLY]: 13,
        [BLOCK_TYPES.LIST]: 10,
        [BLOCK_TYPES.BUTTONS]: 3,
    },
    FACEBOOK: {
        [BLOCK_TYPES.QUICK_REPLY]: 13,
        [BLOCK_TYPES.LIST]: 10,
        [BLOCK_TYPES.BUTTONS]: 3,
    },
    INSTAGRAM: {
        [BLOCK_TYPES.QUICK_REPLY]: 13,
        [BLOCK_TYPES.LIST]: 10,
        [BLOCK_TYPES.BUTTONS]: 3,
    },
    WEB: {
        [BLOCK_TYPES.QUICK_REPLY]: 13,
        [BLOCK_TYPES.LIST]: 10,
        [BLOCK_TYPES.BUTTONS]: 10,
    },
    OMNICHANNEL: {
        [BLOCK_TYPES.QUICK_REPLY]: 13,
        [BLOCK_TYPES.LIST]: 10,
        [BLOCK_TYPES.BUTTONS]: 3,
    },
};

export function validationMaxOptions(typeOptionMessage: OptionsTypesMessages) {
    const currentTypeChannel = currentChannelStore.getState().currentTypeChannel;
    return MAX_OPTIONS_BY_CHANNEL[currentTypeChannel][typeOptionMessage];
}

export function ValidationsOptionsSize(options: ButtonOption[], typeOptionMessage: OptionsTypesMessages) {
    const maxOptions = validationMaxOptions(typeOptionMessage);

    if (options.length >= maxOptions) {
        throw new Error(`Solo puedes agregar ${maxOptions} opciones`);
    }
}
