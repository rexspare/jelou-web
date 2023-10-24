import debounce from "lodash/debounce";
import get from "lodash/get";
import { useState } from "react";
import { Node, useReactFlow } from "reactflow";

import CircularProgress from "@builder/common/CircularProgressbar";
import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { BLOCK_TYPES, MESSAGE_KEYS } from "@builder/modules/Nodes/message/domain/constants.message";
import { ButtonBlock, MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { QuickReplyStaticOptions } from "@builder/modules/Nodes/message/domain/quickReplay";
import { MAX_LENGTH_CAPTION_QUICK_REPLY, MAX_LENGTH_HEADER_QUICK_REPLY, getButtonsBodyMaxLength } from "@builder/modules/Nodes/message/domain/sizeMessage.validation";

import { DinamicOptions } from "../DinamicOptions";
import { StaticOption } from "../StaticOptions";
import { SelectUneTimeButtons } from "./SelectOneTimeButtons";

type ButtonsPanelProps = {
    nodeId: string;
    messageId: string;
};

export const ButtonsPanel = ({ nodeId, messageId }: ButtonsPanelProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const { messages } = get(currentNode, "data.configuration") ?? {};
    const { text = "", caption = "", title = "" } = messages[0] as ButtonBlock;

    const { updateLocalNode } = useCustomsNodes();
    const quickReplayStatic = new QuickReplyStaticOptions(messageId, BLOCK_TYPES.BUTTONS);

    const [options, setOptions] = useState(() => quickReplayStatic.getAllOptions(currentNode.data.configuration.messages));
    const maxLength = getButtonsBodyMaxLength();

    const handleOnChangeText = debounce((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { id, data } = currentNode;
        const { name, value } = event.target;

        const configuration = quickReplayStatic.makeListBlockConfig(data, name, value);
        updateLocalNode(id, { configuration });
    }, 800);

    return (
        <section className="border-gray-230 px-6 py-4">
            <div className="mb-2">
                <TextInput
                    onChange={handleOnChangeText}
                    defaultValue={title}
                    label="Encabezado"
                    placeholder="Escribe tu título"
                    hasError=""
                    name={MESSAGE_KEYS.TITLE}
                    maxLength={MAX_LENGTH_HEADER_QUICK_REPLY}
                />
                <CircularProgress MAXIMUM_CHARACTERS={MAX_LENGTH_HEADER_QUICK_REPLY} MINIMUM_CHARACTERS={0} countFieldLength={title.length} />
            </div>

            <div className="mb-2">
                <TextAreaInput onChange={handleOnChangeText} defaultValue={text} label="Contenido" placeholder="Escribe tu mensaje" hasError="" name={MESSAGE_KEYS.TEXT} maxLength={maxLength} />
                <CircularProgress MAXIMUM_CHARACTERS={maxLength} MINIMUM_CHARACTERS={0} countFieldLength={text.length} />
            </div>

            <div className="mb-2">
                <TextInput
                    onChange={handleOnChangeText}
                    defaultValue={caption}
                    label="Pie de página"
                    placeholder="Escribe tu pie de página"
                    hasError=""
                    name={MESSAGE_KEYS.CAPTION}
                    maxLength={MAX_LENGTH_CAPTION_QUICK_REPLY}
                />
                <CircularProgress MAXIMUM_CHARACTERS={MAX_LENGTH_CAPTION_QUICK_REPLY} MINIMUM_CHARACTERS={0} countFieldLength={caption.length} />
            </div>

            <SelectUneTimeButtons nodeId={nodeId} />

            <DinamicOptions typeOptionMessage={BLOCK_TYPES.BUTTONS} options={options} setOptions={setOptions} messageId={messageId} nodeId={nodeId} />

            <p className="my-4 border-b-1 border-gray-330"></p>

            <StaticOption typeOptionMessage={BLOCK_TYPES.BUTTONS} options={options} setOptions={setOptions} messageId={messageId} nodeId={nodeId} />
        </section>
    );
};
