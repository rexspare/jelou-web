import { BaseConfiguration } from "../../domain/nodes";

export enum INPUTS_NAMES_TOOL_CONFIG_PANEL {
    VERSION = "version",
    VARIABLE = "variable",
}

export type ToolsNodesInitialData = {
    toolId: number;
    toolkitId: number;
    toolName: string;
    principalColor: string;
    complementaryColor: string;
    thumbnail: number | string;
};

export type IToolNode = {
    configuration: BaseConfiguration & {
        input?: object;
        output?: object;
        version?: string;
        variable?: string;
        toolData?: ToolsNodesInitialData;
    };
};
