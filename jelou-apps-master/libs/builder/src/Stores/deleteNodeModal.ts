import { create } from "zustand";
import { DeleteModalStore } from "./types.stores";

export const deleteNodeModalStore = create<DeleteModalStore>((set) => ({
    nodeIdToDelete: null,
    setNodeIdToDelete: (nodeId) => set({ nodeIdToDelete: nodeId }),
}));
