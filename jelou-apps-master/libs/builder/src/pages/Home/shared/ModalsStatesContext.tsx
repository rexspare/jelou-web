import { createContext, useContext, useState } from "react";

export enum TYPE_MODAL {
    TOOLKIT = "TOOLKIT",
    TOOL = "TOOL",
}

type ModalsStates = {
    isOpen: boolean;
    id: number | null;
    type: TYPE_MODAL | null;
};

type ModalsContext = {
    showDeleteModal: ModalsStates;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<ModalsStates>>;
    showEditModal: ModalsStates;
    setShowEditModal: React.Dispatch<React.SetStateAction<ModalsStates>>;
};

const ToolkitContext = createContext<ModalsContext | null>(null);

export const useModalsStatesContext = (): ModalsContext => {
    const context = useContext(ToolkitContext);

    if (!context) {
        throw new Error("useModalsStatesContext must be used within a ToolkitContext");
    }

    return context;
};

export const ModalsStatesProvider = ({ children }: { children: React.ReactNode }) => {
    const [showDeleteModal, setShowDeleteModal] = useState<ModalsStates>({ isOpen: false, id: null, type: null });
    const [showEditModal, setShowEditModal] = useState<ModalsStates>({ isOpen: false, id: null, type: null });

    const value = {
        showDeleteModal,
        setShowDeleteModal,
        showEditModal,
        setShowEditModal,
    };

    return <ToolkitContext.Provider value={value}>{children}</ToolkitContext.Provider>;
};
