import { Node, useReactFlow, useUpdateNodeInternals } from "reactflow";

import { loadingWorkfloStore, useWorkflowStore } from "@builder/Stores";
import { ServerNodeAdapter } from "@builder/modules/Nodes/Infrastructure/ServerNode.Adapter";
import { NodeRepository } from "@builder/modules/Nodes/Infrastructure/nodes.repository";
import { UpdaterNode } from "@builder/modules/Nodes/application/updateNode";
import { ServerNode } from "@builder/modules/Nodes/domain/nodes";

export function useCustomsNodes() {
    const { setNodes } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();

    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);
    const setIsLoadingWorkflow = loadingWorkfloStore((state) => state.setIsLoadingWorkflow);

    const updater = new UpdaterNode(new NodeRepository(String(workflowId)), new ServerNodeAdapter());

    const updateLocalNode = async (nodeId: string, data: Partial<ServerNode>) => {
        setNodes((nodes) => nodes.map((node) => (node.id === nodeId ? { ...node, data } : node)));
        updateNodeInternals(nodeId);
    };

    const updateServerNode = async (node: Node) => {
        setIsLoadingWorkflow(true);

        try {
            return await updater.serverNode(node);
        } finally {
            setIsLoadingWorkflow(false);
        }
    };

    return { updateLocalNode, updateServerNode };
}
