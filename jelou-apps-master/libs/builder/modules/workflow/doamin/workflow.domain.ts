import { EdgesServer } from "@builder/modules/Edges/domain/edge";
import { ServerNode } from "@builder/modules/Nodes/domain/nodes";

export type Workflow = {
    id: number;
    name: string;
    type: string;
    appId: string;
    companyId: number;
    initialState: string;
    configuration: object;
    state: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    Nodes: ServerNode[];
    Edges: EdgesServer[];
};

export type Workflows = Workflow[];

export interface OneWorkflow extends Workflow {
    Nodes: ServerNode[];
    Edges: EdgesServer[];
}

export type SelectOption = {
    label: string;
    value: string;
};

export type WorkflowProps = {
    id: number;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    isArchived: boolean;
};
