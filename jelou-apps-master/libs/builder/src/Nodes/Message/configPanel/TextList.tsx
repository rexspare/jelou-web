import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { Node, useReactFlow } from "reactflow";

import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { BLOCK_TYPES, MESSAGE_KEYS } from "@builder/modules/Nodes/message/domain/constants.message";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { QuickReplyStaticOptions } from "@builder/modules/Nodes/message/domain/quickReplay";
import { MAX_LENGTH_HEADER_QUICK_REPLY, getButtonsBodyMaxLength, getMaxLengthByBlockType, validationListTextMessage } from "@builder/modules/Nodes/message/domain/sizeMessage.validation";

import CircularProgress from "@builder/common/CircularProgressbar";
import { DinamicOptions } from "./DinamicOptions";
import { StaticOption } from "./StaticOptions";

type TextListPanelProps = {
    nodeId: string;
    messageId: string;
    text: string;
    title: string;
    button: string;
};

export const TextListPanel = ({ messageId, text, nodeId, title, button }: TextListPanelProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const { updateLocalNode } = useCustomsNodes();
    const quickReplayStatic = new QuickReplyStaticOptions(messageId, BLOCK_TYPES.LIST);

    const [options, setOptions] = useState(() => quickReplayStatic.getAllOptions(currentNode.data.configuration.messages));
    const [hasError, setHasError] = useState<string | undefined>(undefined);

    const titleLength = !isEmpty(title) ? title.length : 0;
    const buttonLength = !isEmpty(button) ? button.length : 0;

    const maxLenght = getButtonsBodyMaxLength();
    const maxButtonLenght = getMaxLengthByBlockType(BLOCK_TYPES.BUTTONS);

    const handleOnChangeText = debounce((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { id, data } = currentNode;
        const { name, value } = event.target;

        const { message } = validationListTextMessage(value);
        setHasError(message);
        if (message) return;

        const newConfiguration = quickReplayStatic.makeListBlockConfig(data, name, value);
        updateLocalNode(id, { configuration: newConfiguration });
    }, 500);

    return (
        <section className="px-6 py-4">
            <div className="mb-2">
                <TextInput
                    defaultValue={title}
                    label="Encabezado"
                    name="title"
                    placeholder="Escribe tu título"
                    hasError={null}
                    onChange={handleOnChangeText}
                    maxLength={MAX_LENGTH_HEADER_QUICK_REPLY}
                />
                <div className="mt-1">
                    <CircularProgress MAXIMUM_CHARACTERS={MAX_LENGTH_HEADER_QUICK_REPLY} MINIMUM_CHARACTERS={0} countFieldLength={titleLength} />
                </div>
            </div>
            <div className="mb-2">
                <TextAreaInput
                    onChange={handleOnChangeText}
                    defaultValue={text}
                    label="Contenido"
                    placeholder="Escribe tu mensaje"
                    hasError={hasError}
                    name={MESSAGE_KEYS.TEXT}
                    maxLength={maxLenght}
                />
                <CircularProgress MAXIMUM_CHARACTERS={maxLenght} MINIMUM_CHARACTERS={0} countFieldLength={text.length} />
            </div>

            <div className="mb-2">
                <TextInput
                    defaultValue={button}
                    label="Nombre del botón"
                    name="button"
                    placeholder="Escribe el nombre de tu botón"
                    hasError={null}
                    onChange={handleOnChangeText}
                    maxLength={maxButtonLenght}
                />
                <div className="mt-1">
                    <CircularProgress MAXIMUM_CHARACTERS={maxButtonLenght} MINIMUM_CHARACTERS={0} countFieldLength={buttonLength} />
                </div>
            </div>

            <DinamicOptions typeOptionMessage={BLOCK_TYPES.LIST} options={options} setOptions={setOptions} messageId={messageId} nodeId={nodeId} />

            <p className="my-4 border-b-1 border-gray-330"></p>

            <StaticOption typeOptionMessage={BLOCK_TYPES.LIST} options={options} setOptions={setOptions} messageId={messageId} nodeId={nodeId} />
        </section>
    );
};
