import debounce from "lodash/debounce";
import { useState } from "react";
import { Node, useReactFlow } from "reactflow";

import CircularProgress from "@builder/common/CircularProgressbar";
import { TextAreaInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { BLOCK_TYPES, MESSAGE_KEYS } from "@builder/modules/Nodes/message/domain/constants.message";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { QuickReplyStaticOptions } from "@builder/modules/Nodes/message/domain/quickReplay";
import { MAX_LENGTH_QUICK_BODY_TEXT_BY_CHANNEL } from "@builder/modules/Nodes/message/domain/sizeMessage.validation";
import { DinamicOptions } from "./DinamicOptions";
import { StaticOption } from "./StaticOptions";

type QuickRepliesPanelProps = {
    nodeId: string;
    messageId: string;
    text: string;
};

export const QuickRepliesPanel = ({ nodeId, messageId, text }: QuickRepliesPanelProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const { updateLocalNode } = useCustomsNodes();
    const quickReplayStatic = new QuickReplyStaticOptions(messageId, BLOCK_TYPES.QUICK_REPLY);

    const [options, setOptions] = useState(() => quickReplayStatic.getAllOptions(currentNode.data.configuration.messages));
    // const [hasError, setHasError] = useState<string | undefined>(undefined);

    const handleOnChangeText = debounce((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, data } = currentNode;
        const { name, value } = event.target;

        // const { message } = validationListTextMessage(value);
        // setHasError(message);
        // if (message) return;

        const newConfiguration = quickReplayStatic.makeListBlockConfig(data, name, value);
        updateLocalNode(id, { configuration: newConfiguration });
    }, 800);

    return (
        <section className="border-t-1 border-gray-230 px-6 py-4">
            <div className="mb-2">
                <TextAreaInput
                    onChange={handleOnChangeText}
                    defaultValue={text}
                    label=""
                    placeholder="Escribe tu mensaje"
                    hasError=""
                    name={MESSAGE_KEYS.TEXT}
                    maxLength={MAX_LENGTH_QUICK_BODY_TEXT_BY_CHANNEL}
                />
                <CircularProgress MAXIMUM_CHARACTERS={MAX_LENGTH_QUICK_BODY_TEXT_BY_CHANNEL} MINIMUM_CHARACTERS={0} countFieldLength={text.length} />
            </div>

            <DinamicOptions typeOptionMessage={BLOCK_TYPES.QUICK_REPLY} options={options} setOptions={setOptions} messageId={messageId} nodeId={nodeId} />

            <p className="my-4 border-b-1 border-gray-330"></p>

            <StaticOption typeOptionMessage={BLOCK_TYPES.QUICK_REPLY} options={options} setOptions={setOptions} messageId={messageId} nodeId={nodeId} />
        </section>
    );
};
