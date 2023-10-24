import isEmpty from "lodash/isEmpty";
import type { Node } from "reactflow";

import { IServerNodeAdapter } from "../domain/node.adapters";
import { ServerNode } from "../domain/nodes";

export class ServerNodeAdapter implements IServerNodeAdapter<ServerNode, Node> {
    public parser = (node: ServerNode): Node => {
        const { id, posX, posY, NodeType, configuration, collapsed, title, comments, workflowId } = node;
        const { type, displayNames } = NodeType;
        const position = { x: Number(posX), y: Number(posY) };

        const data = {
            configuration: {
                ...configuration,
                collapsed,
                comments,
                workflowId,
                title: title ?? displayNames.es,
            },
        };

        return { id: String(id), position, data, type };
    };

    public parserList = (initialsNodes: ServerNode[]): Node[] => {
        if (isEmpty(initialsNodes)) return [];
        return initialsNodes.map(this.parser);
    };
}
