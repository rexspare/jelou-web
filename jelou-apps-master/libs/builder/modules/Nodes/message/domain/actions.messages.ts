import type { Node } from "reactflow";

import { Block, MessageNode } from "./message.domain";
import { ButtonOption } from "./quickReplay";

type UpdateOptionPayload = {
    targetId: string;
    skillId: string;
};

// export function updateOptionPayload({ messageNode, messageId, optionId, skillId, targetId }: UpdateOptionPayload) {
//     const message = messageNode.data.configuration.messages.find((message) => message.id === messageId) || { options: [] };

//     const option = message.options.find((option) => option.id === optionId) || ({ payload: {} } as ButtonOption);

//     const newOption: ButtonOption = {
//         ...option,
//         payload: {
//             type: "edge",
//             targetId,
//             skillId,
//         },
//     };

//     const newOptions = message.options.map((option) => (option.id === optionId ? newOption : option));
//     const newMessages = messageNode.data.configuration.messages.map((message) => (message.id === messageId ? { ...message, options: newOptions } : message));

//     const newConfiguration = {
//         ...messageNode.data.configuration,
//         messages: newMessages,
//     };

//     const newNode = {
//         ...messageNode,
//         data: {
//             ...messageNode.data,
//             configuration: newConfiguration,
//         },
//     };

//     return { newConfiguration, newNode };
// }

export class OptionsPayloadMessageNode {
    constructor(private messageNode: Node<MessageNode>, private messageId: string, private optionId: string) {}

    private getMessageAndOption() {
        const message = this.messageNode.data.configuration.messages.find((message) => message.id === this.messageId) || { options: [] };

        const option = message.options.find((option) => option.id === this.optionId) || ({ payload: {} } as ButtonOption);
        return { message, option };
    }

    private updateOptionPayload({ skillId = null, targetId = null }: { skillId?: string | null; targetId?: string | null }) {
        const { message, option } = this.getMessageAndOption();

        const newOption: ButtonOption = {
            ...option,
            payload: {
                type: "edge",
                targetId,
                skillId,
            },
        };

        const newOptions = message.options.map((option) => (option.id === this.optionId ? newOption : option));
        const newMessages = this.messageNode.data.configuration.messages.map((message) => (message.id === this.messageId ? { ...message, options: newOptions } : message));

        return newMessages;
    }

    private updateConfiguration(messages: Block[]) {
        const configuration = {
            ...this.messageNode.data.configuration,
            messages,
        };

        const optionMessageNode = {
            ...this.messageNode,
            data: {
                ...this.messageNode.data,
                configuration,
            },
        };

        return { configuration, optionMessageNode };
    }

    update({ skillId, targetId }: UpdateOptionPayload) {
        const messages = this.updateOptionPayload({ skillId, targetId });
        const { configuration, optionMessageNode } = this.updateConfiguration(messages);

        return { configuration, optionMessageNode };
    }

    clear() {
        const messages = this.updateOptionPayload({});
        const { configuration, optionMessageNode } = this.updateConfiguration(messages);

        return { configuration, optionMessageNode };
    }
}
