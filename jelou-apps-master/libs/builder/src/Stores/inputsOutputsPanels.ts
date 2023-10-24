import { create } from "zustand";

import type { InputOutputPanelsStore } from "./types.stores";

export const inputsOutputsPanelsStore = create<InputOutputPanelsStore>((set) => ({
    isCreateInputModal: false,
    isCreateOutputModal: false,
    isOutputAdminModal: false,

    setCreateInputModal: (option) => set({ isCreateInputModal: option }),
    setCreateOutputModal: (option) => set({ isCreateOutputModal: option }),
    setOutputAdminModal: (option) => set({ isOutputAdminModal: option }),
}));
