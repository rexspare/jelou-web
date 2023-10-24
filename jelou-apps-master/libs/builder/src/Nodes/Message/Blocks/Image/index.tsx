import get from "lodash/get";
import { Node, useReactFlow } from "reactflow";

import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { RenderImg } from "./RenderImg";

type MediaBlockProps = {
    messageId: string;
    nodeId: string;
};

export const MediaBlock = ({ messageId, nodeId }: MediaBlockProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const messages = get(currentNode, "data.configuration.messages") || [];
    const { url = "", caption, type = "" } = messages.find((message) => message.id === messageId) || {};

    const saveUrlMedia = (url: string) => async () => {
        // Add your implementation here
    };

    return (
        <div aria-label="mediaBlock" className="shadow-nodo w-full overflow-hidden rounded-10">
            <RenderImg saveUrlMedia={saveUrlMedia} url={url} type={type as BLOCK_TYPES} isImageRender />
            {caption && <p className="bg-white p-3 text-13 text-gray-400">{caption}</p>}
        </div>
    );
};
