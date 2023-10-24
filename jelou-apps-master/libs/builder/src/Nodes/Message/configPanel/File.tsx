import { debounce } from "lodash";
import { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";

import CircularProgress from "@builder/common/CircularProgressbar";
import { TextInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { getFileNameMaxLenght } from "@builder/modules/Nodes/message/domain/sizeMessage.validation";
import { RenderImg } from "../Blocks/Image/RenderImg";

type FileBlockPanelProps = {
    nodeId: string;
    messageId: string;
    mediaUrl: string;
    name: string;
};

export const FileBlockPanel = ({ nodeId, messageId, mediaUrl, name }: FileBlockPanelProps) => {
    const { updateData } = useFileBlockPanel(nodeId, messageId);

    const saveUrlMedia = useCallback((url: string) => () => updateData({ key: "url", value: url }), [nodeId]);
    const maxLength = getFileNameMaxLenght();

    const handleInputFileNameChange = debounce((evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        updateData({ key: name, value });
    }, 500);

    return (
        <div className="items-center pb-4">
            <RenderImg url={mediaUrl} showBtnAddMedia isImageRender={false} saveUrlMedia={saveUrlMedia} type={BLOCK_TYPES.FILE} />

            <div className="flex flex-col px-6 gap-y-1 text-gray-400">
                <TextInput
                    hasError=""
                    label="Nombre del archivo"
                    name="name"
                    defaultValue={name}
                    placeholder="Escribe el nombre del archivo"
                    onChange={handleInputFileNameChange}
                    maxLength={maxLength}
                />
                <CircularProgress MAXIMUM_CHARACTERS={maxLength} MINIMUM_CHARACTERS={0} countFieldLength={name.length} />
            </div>
        </div>
    );
};

type UpdateData = {
    key: string;
    value: string;
};

function useFileBlockPanel(nodeId: string, messageId: string) {
    const dataNode = useReactFlow().getNode(nodeId) as Node<MessageNode>;
    const { updateLocalNode } = useCustomsNodes();

    const updateData = useCallback(
        ({ key, value }: UpdateData) => {
            const { id: nodeId } = dataNode;
            const { messages = [] } = dataNode.data.configuration || {};

            const newMessages = messages.map((message) => (message.id === messageId ? { ...message, [key]: value } : message));

            const updatedNode: MessageNode = {
                configuration: {
                    ...dataNode.data.configuration,
                    messages: newMessages,
                },
            };

            return updateLocalNode(nodeId, updatedNode);
        },
        [dataNode]
    );

    return { updateData };
}
