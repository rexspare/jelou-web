import { Edge } from "reactflow";

import { EDGES_TYPES } from "../domain/constanst";
import { EdgesServer } from "../domain/edge";
import { IServerEdgeAdapter } from "../domain/edge.adapters";
import { EdgeRepository } from "../domain/edgeRepository";

type ChangeIdEdge = (eds: Edge[]) => Edge[];

export class EdgeCreator<T> {
    constructor(private readonly edgeRepository: EdgeRepository, private readonly edgeAdapter: IServerEdgeAdapter<EdgesServer, T>) {}

    public async create(edge: Edge) {
        const { type = EDGES_TYPES.DEFAULT, source, target, markerEnd, sourceHandle, targetHandle, id } = edge || {};

        const createNewEdge = {
            id,
            type,
            sourceId: source,
            targetId: target,
            configuration: {
                markerEnd,
                sourceHandle,
                targetHandle,
            },
        };

        const createdEdge = await this.edgeRepository.create(createNewEdge);
        return this.edgeAdapter.parser(createdEdge);
    }

    /**
     * this function changes the current id of the edge (it's temporal id as uuid) to the new id created in the database (it's id as number).
     */
    static changeIdEdge =
        (temporalId: string, newId: number | string): ChangeIdEdge =>
        (eds) =>
            eds.map((edge) => {
                return edge.id === temporalId ? { ...edge, id: String(newId) } : edge;
            });
}
