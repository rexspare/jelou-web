import { IServerNodeAdapter } from "../../../src/Nodes/domain/node.adapters";
import { INodeRepository } from "../../../src/Nodes/domain/node.respository";
import { ServerNode } from "../../../src/Nodes/domain/nodes";

export class GetNode<T> {
    constructor(private readonly nodeRepository: INodeRepository, private readonly nodeServerAdapter: IServerNodeAdapter<ServerNode, T>) {}

    public async all(): Promise<T[]> {
        const serverNodes = await this.nodeRepository.getAll();
        return this.nodeServerAdapter.parserList(serverNodes);
    }
}
