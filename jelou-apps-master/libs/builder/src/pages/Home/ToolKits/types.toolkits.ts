import { EdgesServer } from "@builder/modules/Edges/domain/edge";
import { ServerNode } from "@builder/modules/Nodes/domain/nodes";
import { Output, OutputsTypes } from "@builder/modules/OutputTools/domain/outputs.domain";
import { Workflow } from "@builder/modules/workflow/doamin/workflow.domain";

export type Toolkit = {
    id: number;
    name: string;
    description: string;
    companyId: number;
    state: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    Tools: Tools;
};

export type Toolkits = Toolkit[];

export type Tool = {
    id: number;
    name: string;
    ownerId: string;
    description: string;
    toolkitId: number;
    workflowId: number;
    configuration: ConfigurationTool;
    state: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    Inputs: Input[];
    Outputs: Output[];
    workflow?: IAWorkflow;
};

export type MarketplaceTool = {
    appId: string;
    author: {
        email: string;
    };
    createdAt: string;
    ownerId?: string;
    privacy: string;
    readonly: boolean;
    snapshot: {
        Workflow: Workflow;
        Tool: Tool;
        Inputs: Input[];
        Outputs: Output[];
    };
    type: string;
    updatedAt: string;
    version: string;
    workflowId: string;
    _id: string;
};

export type ConfigurationTool = {
    principalColor: string;
    complementaryColor: string;
    thumbnail: string | number;
};

export type Tools = Tool[];

export type InputsTypes = "BOOLEAN" | "STRING" | "NUMBER" | "ENUM" | "OBJECT" | "ARRAY";

export interface ObjectList {
    id: number;
    displayName: string;
    name: string;
    type: string;
    required: boolean;
    value?: string;
}

export type SelectOption = {
    label: string;
    value: string;
};

export type MainDataInput = {
    name: string;
    description: string;
    displayName: string;
    required: boolean;
    type?: InputsTypes;
    configuration?: ConfigurationInput;
};

export type EnumList = {
    value: string;
    label: string;
    order?: number;
};

export type ConfigurationInput = {
    type?: string;
    enumList?: EnumList[];
    objectList?: ObjectList[];
};

export type Input = {
    id: number;
    name: string;
    description: string;
    type: InputsTypes;
    displayName: string;
    required: boolean;
    toolId: number;
    state: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    configuration: ConfigurationInput;
};

// Execution tools types
interface ExecutionOutput extends Output {
    value: unknown;
}

export interface OutputExecution {
    output?: ExecutionOutput;
    executionId: string;
}

export type LogsExecution = {
    _id: string;
    appId: string;
    createdAt: string;
    executionId: string;
    executionTime: number;
    finalState: unknown;
    initialState: unknown;
    name: string;
    nodeId: string;
    nodeTypeId: string;
    type: OutputsTypes;
    updatedAt: string;
};

export type CreatedTool = {
    toolkitId: string;
    name: string;
    description: string;
    tags: string[];
    thumbnail: string | number;
    thumbnails: Thumbnail[];
    principalColor: string;
    complementaryColor: string;
};

export type IAWorkflow = {
    name: string;
    description: string;
    edges: EdgesServer[];
    nodes: ServerNode[];
    inputs: Input[];
    outputs: Output[];
};

export type Thumbnail = {
    id: number;
    Icon:
        | React.FC<{
              width?: number;
              height?: number;
              color?: string;
          }>
        | string;
};

export enum CREATE_EDIT_STEP {
    MAIN_DATA = "MAIN_DATA",
    THUMBNAIL = "THUMBNAIL",
    COLORS = "COLORS",
    TOOLKIT = "TOOLKIT",
}

export enum TOOL_MODES {
    MANUAL = "MANUAL",
    IA = "IA",
}

export const CREATE_EDIT_STEPS = [
    {
        number: 1,
        id: CREATE_EDIT_STEP.TOOLKIT,
        title: "Selecciona toolkit",
        hasLine: true,
    },
    {
        number: 2,
        id: CREATE_EDIT_STEP.MAIN_DATA,
        title: "Datos principales",
        hasLine: true,
    },
    {
        number: 3,
        id: CREATE_EDIT_STEP.THUMBNAIL,
        title: "Escoge un Thumbnail",
        hasLine: true,
    },
    {
        number: 4,
        id: CREATE_EDIT_STEP.COLORS,
        title: "Selecciona Colores",
        hasLine: false,
    },
];

export const DEFAULT_TOOL = {
    principalColor: "#E6F6F9",
    complementaryColor: "#00B3C7",
};

export type ToolkitDataProps = {
    createdTool: CreatedTool;
    onClose: () => void;
    handleAddData: (tool: Partial<CreatedTool>) => void;
    handlePrimaryClick: (currentStep: CREATE_EDIT_STEP) => void;
};
