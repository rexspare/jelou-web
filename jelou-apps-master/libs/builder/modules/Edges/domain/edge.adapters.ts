export interface IServerEdgeAdapter<T, U> {
  parser: (edge: T) => U;
  parserList: (initialsEdges: T[]) => U[];
}