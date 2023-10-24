import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";
import { useQuery } from "@tanstack/react-query";

import { useWorkflowStore } from "@builder/Stores";
import { WORKFLOWS_KEY_RQ } from "@builder/constants.local";
import { OneWorkflow } from "@builder/modules/workflow/doamin/workflow.domain";
import { getOneWorkflow } from "@builder/services/workflows";
import { Tool } from "../Home/ToolKits/types.toolkits";

type WorkflowType = {
    tool?: Tool;
    isLoadingTools: boolean;
    workflowId: string;
    workflowTool?: OneWorkflow;
    isLoadingWorkflow: boolean;
};

export default function useWorkflow(): WorkflowType {
    const setCurrentWorkflow = useWorkflowStore((state) => state.setCurrentWorkflow);
    const { tool, isLoadingTools } = useQueryTool();
    const { workflowId } = tool ?? {};

    const { data: workflowTool, isLoading: isLoadingWorkflow } = useQuery([WORKFLOWS_KEY_RQ, workflowId], () => getOneWorkflow(String(workflowId), { includeEdges: true, includeNodes: true }), {
        enabled: Boolean(workflowId),
        onSuccess: (data) => setCurrentWorkflow(data),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return {
        tool,
        isLoadingTools,
        workflowId: String(workflowId),
        workflowTool,
        isLoadingWorkflow,
    };
}
