import { ServerNode } from "@builder/modules/Nodes/domain/nodes";
import type { Node } from "reactflow";

type updateLocalNode = (nodeId: string, data: Partial<ServerNode>) => Promise<void>;
type DeleteBlockConfig = (event: React.MouseEvent<HTMLButtonElement>) => void;
type MessageBlockListType = { id: string };

/**
 * @param currentNode - The node to delete the bubble from
 * @param itemId - The id of the item in the list to delete
 * @param keyOfListName - The key of the list to find the list in the configuration of the node
 */
export const deleteBlockConfig =
    (currentNode: Node, itemId: string, keyOfListName: string, updateLocalNode: updateLocalNode): DeleteBlockConfig =>
    (event) => {
        event.stopPropagation();

        const list: MessageBlockListType[] = currentNode.data.configuration[keyOfListName] || [];
        const newListItems = list.filter((item) => item?.id !== itemId);

        const updateData = {
            configuration: {
                ...currentNode.data.configuration,
                [keyOfListName]: newListItems,
            },
        };

        updateLocalNode(currentNode.id, updateData);
    };
