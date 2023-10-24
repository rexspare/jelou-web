import { create } from "zustand";

import type { ExecuteNodeStore } from "./types.stores";

export const useExecuteNodeStore = create<ExecuteNodeStore>((set) => ({
    selectedNodeId: null,
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    isExecuteHttpNodeModalOpen: false,
    setIsExecuteHttpNodeModalOpen: (open) => set({ isExecuteHttpNodeModalOpen: open }),
}));
