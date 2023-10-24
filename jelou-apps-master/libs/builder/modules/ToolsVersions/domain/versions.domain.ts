import type { Output } from "@builder/modules/OutputTools/domain/outputs.domain";
import type { Workflow } from "@builder/modules/workflow/doamin/workflow.domain";
import type { Input, Tool } from "@builder/pages/Home/ToolKits/types.toolkits";

export type Version = {
    _id: string;
    version: string;
    workflowId: string;
    type: string;
    appId: string;
    snapshot: Snapshot;
    author: Author;
    ownerId: string;
    privacy: string;
    readonly: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type Author = {
    id: number;
    name: string;
    email: string;
    username?: null;
    company: Company;
};

export type Company = {
    id: number | null;
    // name: null | string;
};

export type Snapshot = {
    Workflow: Workflow;
    Tool: Tool;
    Inputs: Input[];
    Outputs: Output[];
};
