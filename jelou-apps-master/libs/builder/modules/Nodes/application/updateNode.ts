import type { Node } from "reactflow";

import { IServerNodeAdapter } from "../domain/node.adapters";
import { INodeRepository } from "../domain/node.respository";
import { BaseConfiguration, ServerNode } from "../domain/nodes";

export class UpdaterNode<T> {
    constructor(private readonly nodeRepository: INodeRepository, private readonly nodeAdapter: IServerNodeAdapter<ServerNode, T>) {}
    public serverNode(node: Node) {
        const { title, collapsed, comments, workflowId, ...configuration } = node.data.configuration as BaseConfiguration;
        const { x, y } = node.position;

        const posX = String(x);
        const posY = String(y);

        const serverNode = { configuration, title, collapsed, ...(comments !== "" ? { comments } : {}), posX, posY };
        return this.update(serverNode, node.id);
    }

    public updateNodeTypeId(nodeId: string, nodeTypeId: number) {
        return this.update({ nodeTypeId }, nodeId);
    }

    private async update(node: Partial<ServerNode>, nodeId: string) {
        const updatedNode = await this.nodeRepository.update(node, nodeId);
        return this.nodeAdapter.parser(updatedNode);
    }
}
