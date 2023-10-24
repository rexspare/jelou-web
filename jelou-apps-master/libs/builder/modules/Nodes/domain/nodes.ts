import { ASSIGNMENT_BY_NAMES, ASSIGNMENT_TYPE_NAMES } from "@builder/Nodes/PMA/constants.pma";

export type BaseConfiguration = {
    collapsed: boolean;
    title: string;
    comments: string;
    workflowId: number;
};

export type PMANode = {
    configuration: BaseConfiguration & {
        teamId: number;
        operatorId: number;
        assignment: {
            by: ASSIGNMENT_BY_NAMES;
            type: ASSIGNMENT_TYPE_NAMES;
        };
    };
};

export type IfErrorNode = {
    configuration: BaseConfiguration & {
        terms: {
            value1: string;
            value2: string;
            operator: string;
        }[];
    };
};

export type InputNode = {
    configuration: BaseConfiguration & {
        prompt: string;
        variable: string;
        useMemory: boolean;
    };
};

export type Code = {
    configuration: BaseConfiguration & {
        content: string;
        description: string;
        instruction: string;
        codeInstruction: string;
    };
};

export type End = {
    configuration: BaseConfiguration & {
        outputId: string;
    };
};

export type CreateServerNode = {
    id: string;
    nodeTypeId: number;
    posX: string;
    posY: string;
    configuration: object;
    title: string | null;
};

export type ServerNode = {
    id: string;
    workflowId: number;
    nodeTypeId: number;
    title: string | null;
    configuration: object;
    posX: string;
    posY: string;
    collapsed: boolean;
    comments: string;
    state: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
    NodeType: NodeType;
};

type NodeType = {
    id: number;
    type: string;
    displayNames: DisplayNames;
    state: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
};

type DisplayNames = {
    en: string;
    es: string;
    pt: string;
};
