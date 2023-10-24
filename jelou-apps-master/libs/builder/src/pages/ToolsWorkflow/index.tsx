import { ReactFlowProvider } from "reactflow";

import { SpinnerIcon } from "@builder/Icons";
import { ServerEdgeAdapter } from "@builder/modules/Edges/infrastructure/serverEdge.adapter";
import { ServerNodeAdapter } from "@builder/modules/Nodes/Infrastructure/ServerNode.Adapter";
import { useQueryWorkflow } from "@builder/modules/workflow/infrastructure/queryWorkflow";

import { useQueryTool } from "../Home/ToolKits/hooks/useQueryTools";
import WorkFlow from "../Workflow";
import { FROM_PAGE } from "../constants.home";

export const ToolsWorkflow = () => {
    const { tool, isLoadingTools } = useQueryTool();

    const { workflowId } = tool ?? {};

    const { workflowTool, isFetching } = useQueryWorkflow({ workflowId: Number(workflowId) });

    if (isLoadingTools || isFetching) {
        return (
            <div className="grid h-screen w-screen place-content-center">
                <span className="text-primary-200">
                    <SpinnerIcon width={50} />
                </span>
            </div>
        );
    }

    const { Edges: edgeList = [], Nodes: nodeList = [] } = workflowTool ?? {};

    const initialsNodes = new ServerNodeAdapter().parserList(nodeList);
    const initialsEdges = new ServerEdgeAdapter().parserList(edgeList);

    return (
        <ReactFlowProvider>
            <WorkFlow fromPage={FROM_PAGE.TOOL} initialsEdges={initialsEdges} initialsNodes={initialsNodes} />
        </ReactFlowProvider>
    );
};
