import { MoreIcon } from "@apps/shared/icons";
import type { ListBoxElement } from "@builder/common/Headless/Listbox";
import { OutputsSchemaValues } from "./outputs.domain";

export enum CREATE_OUTPUT_STEP {
    DATA = "DATA",
    SCHEMA = "SCHEMA",
}

export const OUTPUTS_STEPS = [
    {
        id: CREATE_OUTPUT_STEP.DATA,
        number: 1,
        title: "Datos generales",
        hasLine: true,
    },
    {
        id: CREATE_OUTPUT_STEP.SCHEMA,
        number: 2,
        title: "Define tu output",
        hasLine: false,
    },
];

export enum OUTPUT_TYPES {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export const OUTPUTS_TYPES_LABELS = {
    [OUTPUT_TYPES.SUCCESS]: "Éxito",
    [OUTPUT_TYPES.FAILED]: "Error",
};

export const OUTPUT_TYPES_OPTIONS: ListBoxElement[] = [
    {
        value: OUTPUT_TYPES.SUCCESS,
        id: OUTPUT_TYPES.SUCCESS,
        name: OUTPUTS_TYPES_LABELS[OUTPUT_TYPES.SUCCESS],
        description: "Salida de éxito",
    },
    {
        name: OUTPUTS_TYPES_LABELS[OUTPUT_TYPES.FAILED],
        value: OUTPUT_TYPES.FAILED,
        id: OUTPUT_TYPES.FAILED,
        description: "Salida de error",
    },
];

export const DEFAULT_OUTPUT_OPTIONS: ListBoxElement[] = [
    {
        id: 0,
        value: "create-new-output",
        name: "Crear nuevo Output",
        Icon: () => <MoreIcon width={25} height={25} fill="currentColor" />,
    },
];

export const INITIAL_SCHEMA_VALUES: OutputsSchemaValues[] = [
    {
        id: crypto.randomUUID(),
        name: "",
        variable: "",
    },
];
