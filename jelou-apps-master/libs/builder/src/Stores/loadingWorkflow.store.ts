import { create } from 'zustand';

import type { LoadingWorkflowStore } from './types.stores';

export const loadingWorkfloStore = create<LoadingWorkflowStore>((set) => ({
  isLoadingWorkflow: false,
  setIsLoadingWorkflow: (isLoadingWorkflow) => set({ isLoadingWorkflow })
}))
