import { createEdge, edgesServer } from './edge';

export interface EdgeRepository {
  create: (edge: createEdge) => Promise<edgesServer>,
  getAll: () => Promise<edgesServer[]>,
  delete: (edgeId: string) => Promise<string>,
}