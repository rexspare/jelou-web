import z from "zod";

import { Output } from "@builder/modules/OutputTools/domain/outputs.domain";
import { ASSIGNMENT_BY_DIRECT_OPTIONS, ASSIGNMENT_BY_QUEUE_OPTIONS, ASSIGNMENT_TYPE_NAMES, ASSIGNMENT_TYPE_OPTIONS } from "../Nodes/PMA/constants.pma";
import type { Input } from "../pages/Home/ToolKits/types.toolkits";

export const defaultAssignmentType = (defaultType: string) => ASSIGNMENT_TYPE_OPTIONS.find((option) => option.value === defaultType);

export const defaultAssignmentBy = (defaultBy: string, defaultType: string) => {
    if (defaultType === ASSIGNMENT_TYPE_NAMES.DIRECT) {
        return ASSIGNMENT_BY_DIRECT_OPTIONS.find((option) => option.value === defaultBy);
    }

    return ASSIGNMENT_BY_QUEUE_OPTIONS.find((option) => option.value === defaultBy);
};

const schema = z.object({
    name: z.string().min(1, { message: "Debes de agregar un nombre de variable. No puede contener espacios" }),
    type: z.string().min(1, { message: "Debes de agregar un tipo de input" }),
    displayName: z.string().min(1, { message: "Debes de agregar un nombre a mostrar" }),
    description: z.string().min(1, { message: "Debes de agregar una descripción" }),
});

export const validateInputsOutputsError = (inputOutput: Output | Input) => {
    const zodResponse = schema.safeParse(inputOutput);

    if (!zodResponse.success) {
        const issues = zodResponse.error.issues;
        const errors: Record<string, string> = {};

        issues.forEach((issue) => {
            errors[issue.path[0]] = issue.message;
        });

        return Promise.reject(errors);
    }

    return Promise.resolve(zodResponse.data);
};

export const getTimeParsed = (dt2: Date, dt1: Date): string => {
    return dt1.toLocaleDateString("es-ES", { year: "numeric", month: "numeric", day: "numeric" });
};

export const parsePrivacy = (privacy: string): string => {
    switch (privacy) {
        case "public":
            return "Público";
        case "private":
            return "Privado";
        default:
            return "Público";
    }
};
