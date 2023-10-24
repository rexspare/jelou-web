import { ChannelTypes } from "@builder/modules/Channels/domain/channels.domain";
import { Workflow } from "@builder/modules/workflow/doamin/workflow.domain";

export type CredentialsStore = {
    app_id: string;
    app_token: string;
};

export type SelectedNodeStore = {
    previouslyNodeIdSelected?: string;
    nodeIdSelected?: string;
    setNodeIdSelected: (nodeId?: string) => void;
    clearNodeIdSelected: () => void;
};

export type ExecuteNodeStore = {
    selectedNodeId: string | null;
    setSelectedNodeId: (nodeId: string | null) => void;

    isExecuteHttpNodeModalOpen: boolean;
    setIsExecuteHttpNodeModalOpen: (open: boolean) => void;
};

export type WorkflowStore = {
    currentWorkflow: Workflow;
    setCurrentWorkflow: (workflow: Workflow) => void;
};

export type LoadingWorkflowStore = {
    isLoadingWorkflow: boolean;
    setIsLoadingWorkflow: (isLoading: boolean) => void;
};

export type InputOutputPanelsStore = {
    isCreateInputModal: boolean;
    isCreateOutputModal: boolean;
    isOutputAdminModal: boolean;

    setCreateInputModal: (option: boolean) => void;
    setCreateOutputModal: (option: boolean) => void;
    setOutputAdminModal: (option: boolean) => void;
};

export type DeleteModalStore = {
    nodeIdToDelete: string | null;
    setNodeIdToDelete: (nodeId: string | null) => void;
};

export type CurrentChannelStore = {
    currentTypeChannel: ChannelTypes;
    setCurrentTypeChannel: (channelType: ChannelTypes) => void;
};
