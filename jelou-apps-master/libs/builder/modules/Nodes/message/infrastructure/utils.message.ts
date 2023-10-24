import get from "lodash/get";
import { type Node } from "reactflow";

import { NODE_TYPES } from "../../domain/constants";
import { BLOCK_TYPES } from "../domain/constants.message";
import { MessageNode } from "../domain/message.domain";

const actionsMessageBlocks = [BLOCK_TYPES.LIST, BLOCK_TYPES.QUICK_REPLY, BLOCK_TYPES.BUTTONS];
export function isActionMessageNode(node: Node) {
    if (node.type !== NODE_TYPES.MESSAGE) return undefined;

    const messageNode = node as Node<MessageNode>;
    const messages = get(messageNode, "data.configuration.messages") || [];
    return messages.find((message) => actionsMessageBlocks.includes(message.type as BLOCK_TYPES));
}
