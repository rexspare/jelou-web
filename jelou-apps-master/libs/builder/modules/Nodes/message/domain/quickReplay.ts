import { v4 } from "uuid";

import { ListBoxElement } from "@builder/common/Headless/Listbox";
import { Option } from "@builder/common/inputs/types.input";
import { MESSAGE_KEYS } from "./constants.message";
import { MessageNode } from "./message.domain";
import { OptionsTypesMessages, ValidationsOptionsSize } from "./sizeMessage.validation";

export type ButtonOption = {
    id: string;
    type: string;
    title: string;
    description: string;
    payload: {
        type: "edge";
        targetId: string | null;
        skillId?: string | null;
    };
    url: string;
    iterable?: string;
};

export enum BUTTONS_ONE_TIME_TYPES {
    TEXT = "text",
    SKILL = "skill",
}

export type RedirectPayloadText = {
    type: "text";
    text: string;
};

export type RedirectPayloadSkill = {
    type: "edge";
    targetId: null;
    skillId?: number;
};

export type ButtonSettings = {
    oneTimeUseButtons: boolean;
    type?: string;
    redirectPayload?: RedirectPayloadText | RedirectPayloadSkill;
};

export const TYPE_ONE_TIME_BUTTONS_OPTIONS: ListBoxElement[] = [
    {
        id: BUTTONS_ONE_TIME_TYPES.SKILL,
        name: "Skill",
        value: BUTTONS_ONE_TIME_TYPES.SKILL,
        description: "Skill",
    },
    {
        id: BUTTONS_ONE_TIME_TYPES.TEXT,
        name: "Texto",
        value: BUTTONS_ONE_TIME_TYPES.TEXT,
        description: "Text",
    },
];
export enum BUTTONS_OPTIONS_TYPES {
    POSTBACK = "postback",
    URL = "url",
    PHONE_NUMBRER = "phone_number",
}

export enum NAMES_INPUTS_BUTTONS_BLOCK {
    TITLE = "title",
    TYPE = "type",
    URL = "url",
    PAYLOAD = "payload",
    ITERABLE = "iterable",
    DESCRIPTION = "description",
}

export const TYPE_BUTTONS_OPTIONS: Option[] = [
    {
        value: BUTTONS_OPTIONS_TYPES.URL,
        label: "Abrir sitio web",
    },
    {
        value: BUTTONS_OPTIONS_TYPES.POSTBACK,
        label: "Continuar al paso siguiente",
    },
    {
        value: BUTTONS_OPTIONS_TYPES.PHONE_NUMBRER,
        label: "Llamar número",
    },
];

type Messages = MessageNode["configuration"]["messages"];

abstract class QuickReplyOptions {
    protected readonly MESSAGE_KEYS = MESSAGE_KEYS;

    constructor(protected readonly messageId: string) {}

    public getAllOptions(messages: Messages) {
        const { options = [] } = messages.find((message) => message.id === this.messageId) || {};
        return options;
    }

    public makeListBlockConfig(messageConfig: MessageNode, key: string, value: ButtonOption[] | string | ButtonSettings) {
        const { messages = [] } = messageConfig.configuration || {};

        const newMessages = messages.map((message) => (message.id === this.messageId ? { ...message, [key]: value } : message));

        const newConfiguration = {
            ...messageConfig.configuration,
            messages: newMessages,
        };

        return newConfiguration;
    }
}

export class QuickReplyStaticOptions extends QuickReplyOptions {
    constructor(messageId: string, private readonly typeOptionMessage: OptionsTypesMessages) {
        super(messageId);
    }

    public getStaticOptions(options: ButtonOption[]) {
        return options.filter((option) => option?.iterable === undefined);
    }
    public deleteOption(messageConfig: MessageNode, options: ButtonOption[], optionId: string) {
        const newOptions = options.filter((option) => option.id !== optionId);

        const newConfiguration = this.makeListBlockConfig(messageConfig, this.MESSAGE_KEYS.OPTIONS, newOptions);

        return { newConfiguration, newOptions };
    }

    public inputChange(messageConfig: MessageNode, options: ButtonOption[], data: React.ChangeEvent<HTMLInputElement> | Option, optionId: string) {
        const updateOption = {} as Record<string, string>;

        if ("label" in data) {
            const { label, value } = data;
            updateOption[label] = value;
        } else {
            const { value, name } = data.target as HTMLInputElement;
            updateOption[name] = value;
        }

        const newOptions = options.map((option) => (option.id === optionId ? { ...option, ...updateOption } : option));
        const newConfiguration = this.makeListBlockConfig(messageConfig, this.MESSAGE_KEYS.OPTIONS, newOptions);

        return { newConfiguration, newOptions };
    }

    public addOption(messageConfig: MessageNode, options: ButtonOption[]) {
        ValidationsOptionsSize(options, this.typeOptionMessage);

        const newOption: ButtonOption = {
            id: v4(),
            payload: {
                type: "edge",
                targetId: null,
            },
            title: "",
            type: BUTTONS_OPTIONS_TYPES.POSTBACK,
            url: "",
            description: "",
        };

        const newOptions = [...options, newOption];
        const newConfiguration = this.makeListBlockConfig(messageConfig, this.MESSAGE_KEYS.OPTIONS, newOptions);

        return { newConfiguration, newOptions };
    }
}

export class QuickReplyDinamicOptions extends QuickReplyOptions {
    DINAMIC_BUTTON_ID = "dynamic-button";

    public getDinamicOptions(options: ButtonOption[]) {
        return options.filter((option) => option?.iterable !== undefined);
    }

    public addOption(messageConfig: MessageNode, options: ButtonOption[]) {
        const dinamicOptions = options.filter((option) => option?.iterable !== undefined);

        if (dinamicOptions.length > 0) {
            throw new Error("Solo puedes agregar un botón dinámico");
        }

        const newOption: ButtonOption = {
            id: this.DINAMIC_BUTTON_ID,
            title: "",
            type: BUTTONS_OPTIONS_TYPES.POSTBACK,
            url: "",
            description: "",
            iterable: "",
            payload: {
                type: "edge",
                targetId: null,
            },
        };

        const newOptions = [newOption, ...options];
        const newConfiguration = this.makeListBlockConfig(messageConfig, this.MESSAGE_KEYS.OPTIONS, newOptions);

        return { newConfiguration, newOptions };
    }

    public deleteOption(messageConfig: MessageNode, options: ButtonOption[]) {
        const newOptions = options.filter((option) => option.id !== this.DINAMIC_BUTTON_ID);

        const newConfiguration = this.makeListBlockConfig(messageConfig, this.MESSAGE_KEYS.OPTIONS, newOptions);
        return { newConfiguration, newOptions };
    }

    public inputChange(messageConfig: MessageNode, options: ButtonOption[], data: Record<string, string>) {
        const newOptions = options.map((option) => (option.id === this.DINAMIC_BUTTON_ID ? { ...option, ...data } : option));

        const newConfiguration = this.makeListBlockConfig(messageConfig, this.MESSAGE_KEYS.OPTIONS, newOptions);
        return { newConfiguration, newOptions };
    }
}
