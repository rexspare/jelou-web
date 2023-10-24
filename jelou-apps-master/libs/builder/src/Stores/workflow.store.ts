import { create } from "zustand";

import { Workflow } from "@builder/modules/workflow/doamin/workflow.domain";
import type { WorkflowStore } from "./types.stores";

export const useWorkflowStore = create<WorkflowStore>((set) => ({
    currentWorkflow: {} as Workflow,
    setCurrentWorkflow: (currentWorkflow) => set({ currentWorkflow }),
}));
