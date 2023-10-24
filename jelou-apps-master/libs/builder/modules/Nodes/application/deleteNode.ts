import { INodeRepository } from "../domain/node.respository";

export class DeleteNode {
    constructor(private readonly nodeRepository: INodeRepository) {}

    public async delete(nodeId: string): Promise<string> {
        return this.nodeRepository.delete(nodeId);
    }
}
