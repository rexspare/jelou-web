import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useWorkflowStore } from "@builder/Stores";
import { WORKFLOWS_KEY_RQ } from "@builder/constants.local";
import { getOneWorkflow } from "@builder/services/workflows";
import { OneWorkflow } from "../doamin/workflow.domain";

type QueryWorkflow = {
    workflowId?: number;
    successCallback?: (data: OneWorkflow) => void;
};

export function useQueryWorkflow({ workflowId, successCallback }: QueryWorkflow) {
    const setCurrentWorkflow = useWorkflowStore((state) => state.setCurrentWorkflow);
    const queryClient = useQueryClient();

    const QUERY_KEY = [WORKFLOWS_KEY_RQ, workflowId];

    const {
        data: workflowTool,
        isLoading: isLoadingWorkflow,
        isFetching,
    } = useQuery(QUERY_KEY, () => getOneWorkflow(String(workflowId), { includeEdges: true, includeNodes: true }), {
        enabled: Boolean(workflowId),
        onSuccess: (data) => {
            setCurrentWorkflow(data);
            successCallback && successCallback(data);
        },
        refetchOnWindowFocus: false,
    });

    const invalidateWorkflow = () => {
        queryClient.invalidateQueries(QUERY_KEY);
    };

    return {
        isFetching,
        workflowTool,
        isLoadingWorkflow,
        invalidateWorkflow,
    };
}
