import { BaseConfiguration } from "../../domain/nodes";
import { ButtonOption, ButtonSettings } from "./quickReplay";

export type MessageNode = {
    configuration: BaseConfiguration & {
        messages: Block[];
    };
};

export type Audio = {
    id: string;
    type: string;
    url: string;
};

export type FileBlock = {
    id: string;
    type: string;
    url: string;
    name: string;
};

export type ImageBlock = {
    id: string;
    type: string;
    url: string;
    caption: string;
};

// QuickReplyBlock y TextListBlock son iguales
export type QuickReplyBlock = {
    id: string;
    type: string;
    text: string;
    options: ButtonOption[];
};

export type TextListBlock = {
    id: string;
    type: string;
    text: string;
    title: string;
    button: string;
    options: ButtonOption[];
};

export type ButtonBlock = {
    id: string;
    type: string;
    text: string;
    title: string;
    caption: string;
    options: ButtonOption[];
    settings: ButtonSettings;
};

export type VideoBlock = {
    id: string;
    type: string;
    url: string;
    caption: string;
};

export type LocationBlock = {
    id: string;
    type: string;
    name: string;
    address: string;
    coordinates: {
        latitude: string;
        longitude: string;
    };
};

export type TextBlock = {
    id: string;
    type: string;
    text: string;
};

export type StickerBlock = {
    id: string;
    type: string;
    url: string;
    caption: string;
};

export type ContactTypes = ContactBlock["contacts"][0];

export type ContactBlock = {
    id: string;
    type: string;
    contacts: {
        addresses?: {
            id: string;
            street: string;
            type: string;
        }[];
        emails?: {
            id: string;
            email: string;
            type: string;
        }[];
        name: {
            first_name: string;
            formatted_name: string;
            last_name: string;
        };
        org: {
            company: string;
            department: string;
            title: string;
        };
        phones?: {
            id: string;
            phone: string;
            type: string;
        }[];
        urls?: {
            id: string;
            url: string;
            type: string;
        }[];
    }[];
};

export interface Block extends ContactBlock, FileBlock, ImageBlock, LocationBlock, QuickReplyBlock, StickerBlock, TextBlock, TextListBlock, ButtonBlock, VideoBlock, Audio {}
