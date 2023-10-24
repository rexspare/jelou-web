// export enum OUTPUTS_OPTIONS_TYPES {
//     STRING = "string",
//     NUMBER = "number",
//     BOOLEAN = "boolean",
// }

export type OutputsSchemaValues = {
    id: string;
    name: string;
    // type: OUTPUTS_OPTIONS_TYPES;
    variable: string;
};

export enum OUTPUTS_INPUTS_NAMES {
    NAME = "name",
    TYPE = "type",
    VARIABLE = "variable",
    DESCRIPTION = "description",
    REQUIRED = "required",
    DISPLAY_NAME = "displayName",
}

export type OutputsTypes = "SUCCESS" | "FAILED";

export type Output = {
    id: string;
    name: string;
    description: string;
    type: OutputsTypes;
    displayName: string;
    schema: Record<string, string>;
    required: boolean;
    toolId: number;
    state: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type IOutputsRepository = {
    create(output: Partial<Output>): Promise<Output>;
    update(outputId: string, output: Partial<Output>): Promise<Output>;
    delete(outputId: string): Promise<string>;
};
