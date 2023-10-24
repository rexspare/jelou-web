import type { Edge } from "reactflow";
import type { EdgesServer } from "../../../modules/Edges/domain/edge";
import type { IServerEdgeAdapter } from "../../../modules/Edges/domain/edge.adapters";

import isEmpty from "lodash/isEmpty";

export class ServerEdgeAdapter implements IServerEdgeAdapter<EdgesServer, Edge> {
    public parser(edge: EdgesServer): Edge {
        const { id, sourceId, targetId, configuration = {}, type } = edge || {};

    return { id: String(id), source: String(sourceId), target: String(targetId), ...configuration, type, zIndex:1000 };
  }

    public parserList(initialsEdges: EdgesServer[]): Edge[] {
        if (isEmpty(initialsEdges)) return [];
        return initialsEdges.map(this.parser);
    }
}
