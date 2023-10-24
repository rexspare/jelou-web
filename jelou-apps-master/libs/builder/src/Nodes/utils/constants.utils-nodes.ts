import { v4 } from "uuid";

import {
    generateAudioBlockDnD,
    generateButtonBlockWithTextDnD,
    generateButtonsBlockDnD,
    generateContactBlockDefaultDnD,
    generateFileBlockDefaultDnD,
    generateImageBlockDefaultDnD,
    generateLocationBlockDnD,
    generateQuickRepliesBlockDnD,
    generateStickerBlockDefaultDnD,
    generateTextBlockDefaultDnD,
    generateVideoBlockDefaultDnD,
} from "../Message/Blocks/Factory/message-node.blocks";

import { ConditionConfiguration } from "@builder/modules/Nodes/Conditional/infrastructure/ConditionalConfig";
import { CONTENT_TYPE_TYPES, HTTP_HEADER_KEY_NAME, HTTP_METHODS } from "@builder/modules/Nodes/Http/constants.http";
import { OPERATOR_ALL_COMBINATION } from "@builder/modules/Nodes/If/constants.If-config";
import { StickyColorPaletteColor } from "@builder/modules/Nodes/Sticky/domain/sticky.domain";
import { TimerTime } from "@builder/modules/Nodes/Timer/domain/timer.domain";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";

export const configByNodeType = {
    [NODE_TYPES.MESSAGE]: {
        [BLOCK_TYPES.AUDIO]: (defaultId: string) => ({ messages: generateAudioBlockDnD(defaultId) }),
        [BLOCK_TYPES.CONTACT]: (defaultId: string) => ({ messages: generateContactBlockDefaultDnD(defaultId) }),
        [BLOCK_TYPES.FILE]: (defaultId: string) => ({ messages: generateFileBlockDefaultDnD(defaultId) }),
        [BLOCK_TYPES.IMAGE]: (defaultId: string) => ({ messages: generateImageBlockDefaultDnD(defaultId) }),
        [BLOCK_TYPES.LIST]: (defaultId: string) => ({ messages: generateButtonBlockWithTextDnD(defaultId) }),
        [BLOCK_TYPES.LOCATION]: (defaultId: string) => ({ messages: generateLocationBlockDnD(defaultId) }),
        [BLOCK_TYPES.QUICK_REPLY]: (defaultId: string) => ({ messages: generateQuickRepliesBlockDnD(defaultId) }),
        [BLOCK_TYPES.BUTTONS]: (defaultId: string) => ({ messages: generateButtonsBlockDnD(defaultId) }),
        [BLOCK_TYPES.STICKER]: (defaultId: string) => ({ messages: generateStickerBlockDefaultDnD(defaultId) }),
        [BLOCK_TYPES.TEXT]: (defaultId: string) => ({ messages: generateTextBlockDefaultDnD(defaultId) }),
        [BLOCK_TYPES.VIDEO]: (defaultId: string) => ({ messages: generateVideoBlockDefaultDnD(defaultId) }),
    },
    [NODE_TYPES.PMA]: {
        teamId: null,
        assignment: {
            by: null,
            type: null,
        },
        operatorId: null,
    },
    [NODE_TYPES.IF_ERROR]: {
        terms: [
            {
                operator: "equal",
                value1: "{lastNode.data.type}",
                value2: null,
            },
        ],
    },
    [NODE_TYPES.IF]: {
        terms: [
            {
                id: v4(),
                type: null,
                value1: null,
                value2: null,
                operator: null,
            },
        ],
        operator: OPERATOR_ALL_COMBINATION.AND,
    },
    [NODE_TYPES.INPUT]: {
        prompt: null,
        variable: null,
    },
    [NODE_TYPES.HTTP]: {
        url: null,
        method: HTTP_METHODS.GET,
        authentication: {
            type: null,
            enabled: true,
        },
        parameters: [
            {
                key: null,
                value: null,
                enabled: true,
                id: v4(),
            },
        ],
        body: {
            type: CONTENT_TYPE_TYPES.JSON,
            content: null,
            enabled: true,
        },
        headers: [
            {
                key: HTTP_HEADER_KEY_NAME,
                value: CONTENT_TYPE_TYPES.JSON,
                id: HTTP_HEADER_KEY_NAME,
                enabled: true,
            },
        ],
        settings: {
            sslCertificate: true,
            timeout: 30000,
            retries: 0,
            retryOptions: {
                enabled: false,
                retries: 0,
                retryCondition: "is_network_or_idempotent_request_error",
                shouldResetTimeout: false,
                retryDelay: "no_delay",
                milliseconds: 1000,
            },
            proxyOptions: {
                enabled: false,
                protocol: "https",
                ip: "185.228.195.219",
                host: null,
                port: null,
                auth: {
                    username: null,
                    password: null,
                },
            },
        },
    },
    [NODE_TYPES.CODE]: {
        content: `

// Code here

    `,
        description: null,
    },
    [NODE_TYPES.END]: {},
    [NODE_TYPES.TOOL]: {
        input: undefined,
        output: undefined,
        toolId: undefined,
        version: undefined,
        variable: undefined,
        toolData: {},
    },
    [NODE_TYPES.NOTE]: {
        colorPalette: StickyColorPaletteColor.Yellow,
    },
    [NODE_TYPES.TIMER]: {
        duration: 0,
        time: TimerTime.Seconds,
    },
    [NODE_TYPES.EMPTY]: {},
    [NODE_TYPES.CONDITIONAL]: {
        conditions: [
            {
                id: ConditionConfiguration.defaultCondition,
                name: "",
                // operator: OPERATOR_ALL_COMBINATION.AND,
                conditionPanelCollapsed: false,
                terms: [
                    {
                        id: v4(),
                        type: null,
                        value1: null,
                        value2: null,
                        operator: null,
                    },
                ],
            },
        ],
    },
    [NODE_TYPES.RANDOM]: {
        routes: [
            {
                id: v4(),
                name: "",
                weight: 1,
                collapsed: false,
            },
        ],
    },
    [NODE_TYPES.DATUM]: {
        action: undefined,
        databaseId: undefined,
        variable: undefined,
        row: {
            id: undefined,
            data: {},
        },
        query: [],
    },
    [NODE_TYPES.MEMORY]: {
        variable: "",
        value: "",
    },
};
