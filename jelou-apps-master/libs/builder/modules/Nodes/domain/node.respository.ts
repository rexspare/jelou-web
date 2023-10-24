import { CreateServerNode, ServerNode } from "./nodes";

export interface INodeRepository {
  create: (node: CreateServerNode) => Promise<ServerNode>,
  update: (node: Partial<CreateServerNode>, nodeId: string) => Promise<ServerNode>,
  delete: (nodeId: string) => Promise<string>,
  getAll: () => Promise<ServerNode[]>,
}