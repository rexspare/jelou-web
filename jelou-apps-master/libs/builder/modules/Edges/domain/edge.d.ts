type EdgeType = 'success' | 'failed' | 'default'

type EdgeConfiguration = {
  markerEnd: string;
  sourceHandle: string;
  targetHandle: string;
}

export interface EdgesServer {
  id: number;
  type: EdgeType;
  sourceId: number;
  targetId: number;
  workflowId: number;
  configuration: EdgeConfiguration;
  state: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

export interface CreateEdge {
  type: string;
  sourceId: number;
  targetId: number;
  configuration: EdgeConfiguration;
}
