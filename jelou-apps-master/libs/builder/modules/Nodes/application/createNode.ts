import { IServerNodeAdapter } from "../domain/node.adapters";
import { INodeRepository } from "../domain/node.respository";
import { CreateServerNode, ServerNode } from "../domain/nodes";

export class CreatorNode<T> {
    constructor(private readonly nodeRepository: INodeRepository, private readonly nodeAdapter: IServerNodeAdapter<ServerNode, T>) {}

    public async create(node: CreateServerNode) {
        const createdNode = await this.nodeRepository.create(node);
        return await this.nodeAdapter.parser(createdNode);
    }
}
