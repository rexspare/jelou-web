export interface IServerNodeAdapter<T, U> {
  parser: (node: T) => U;
  parserList: (nodes: T[]) => U[];
}