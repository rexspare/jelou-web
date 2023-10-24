import { create } from "zustand";

import type { SelectedNodeStore } from "./types.stores";

export const useConfigNodeId = create<SelectedNodeStore>((set, get) => ({
    nodeIdSelected: undefined,
    previouslyNodeIdSelected: undefined,
    setNodeIdSelected: (id) => {
        const { nodeIdSelected } = get();
        set({ nodeIdSelected: id, previouslyNodeIdSelected: nodeIdSelected });
    },
    clearNodeIdSelected: () => set({ nodeIdSelected: undefined, previouslyNodeIdSelected: undefined }),
}));
