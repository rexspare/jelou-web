import debounce from "lodash/debounce";
import { useState } from "react";
import { Node, useReactFlow } from "reactflow";

import CircularProgress from "@builder/common/CircularProgressbar";
import { TextAreaInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { ServerNode } from "@builder/modules/Nodes/domain/nodes";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { getBodyMessageMaxLength, validateMessageText } from "@builder/modules/Nodes/message/domain/sizeMessage.validation";

type TextBlockPanelProps = {
    nodeId: string;
    text: string;
    messageId: string;
};

type HandleSaveTextProps = {
    updateLocalNode: (nodeId: string, data: Partial<ServerNode>) => Promise<void>;
    messageId: string;
    currentNode: Node<MessageNode>;
};

export const TextBlockPanel = ({ text, messageId, nodeId }: TextBlockPanelProps) => {
    const { getNode } = useReactFlow();
    const { updateLocalNode } = useCustomsNodes();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const [hasError, setHasError] = useState<string | undefined>(undefined);
    const maxLenght = getBodyMessageMaxLength();

    const handleSaveText = ({ messageId, currentNode, updateLocalNode }: HandleSaveTextProps) =>
        debounce((event: React.ChangeEvent<HTMLElement>) => {
            const { value: newText } = event.target as HTMLInputElement;

            const { message } = validateMessageText(newText);
            setHasError(message);
            if (message) return;

            const { messages } = currentNode.data.configuration;
            const newMessages = messages.map((messages) => (messages.id === messageId ? { ...messages, text: newText } : messages));

            const updateData = {
                configuration: {
                    ...currentNode.data.configuration,
                    messages: newMessages,
                },
            };

            updateLocalNode(currentNode.id, updateData);
        }, 800);

    return (
        <div className="px-6 py-4 [&_textarea]:h-72">
            <TextAreaInput
                onChange={handleSaveText({ messageId, currentNode, updateLocalNode })}
                defaultValue={text}
                label=""
                placeholder="Escribe tu mensaje"
                hasError={hasError}
                name="text"
                maxLength={maxLenght}
            />
            <CircularProgress MAXIMUM_CHARACTERS={maxLenght} MINIMUM_CHARACTERS={0} countFieldLength={text.length} />
        </div>
    );
};
