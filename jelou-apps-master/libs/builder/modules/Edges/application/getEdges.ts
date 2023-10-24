import type { EdgesServer } from "../domain/edge";
import type { IServerEdgeAdapter } from "../domain/edge.adapters";
import type { EdgeRepository } from "../domain/edgeRepository";

export class GetEdge<T> {
  constructor(
    private readonly edgeRepository: EdgeRepository,
    private readonly serverEdgeAdapter: IServerEdgeAdapter<EdgesServer, T>) { }

  public async all(): Promise<T[]> {
    const serverEdges = await this.edgeRepository.getAll();
    return this.serverEdgeAdapter.parserList(serverEdges);
  }
}