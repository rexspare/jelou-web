import { ReactFlowProvider, useStoreApi } from "reactflow";

/**
 * This is a custom provider for reactflow, it is used to mock the nodes of the reactflow
 * @param {{
 * TestComponent: React.FC,
 * nodes: import('reactflow').Node[]
 * }} props
 */
export function CustomProviderRF({ nodes, TestComponent }) {
  return (
    <ReactFlowProvider>
      <Provider nodes={nodes}>
        <TestComponent />
      </Provider>
    </ReactFlowProvider>
  );
}

/**
 * @param {{
 * children: React.ReactNode,
 * nodes: import('reactflow').Node[]
 * }} props
 */
function Provider({ children, nodes }) {
  useStoreApi().getState().setNodes(nodes);

  return <>{children}</>;
}
