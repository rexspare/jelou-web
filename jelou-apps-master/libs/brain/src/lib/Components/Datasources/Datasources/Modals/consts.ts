import { STEPS, StepList } from "./types";

export const INIT_STEPS_LIST: StepList[] = [
    {
        id: STEPS.PRINCIPAL_DATA,
        title: {
            en: "Main information",
            es: "Información principal",
            pt: "Informação principal",
        },
        number: 1,
        isActive: true,
        hasLine: true,
        isComplete: false,
    },
    {
        id: STEPS.SELECT_TYPE,
        title: {
            en: "Select a type",
            es: "Escoge un tipo",
            pt: "Escolha um tipo",
        },
        number: 2,
        hasLine: true,
        isActive: false,
        isComplete: false,
    },
    {
        id: STEPS.FILL_DATA,
        title: {
            en: "Fill data",
            es: "Llena los datos",
            pt: "Preencha os dados",
        },
        number: 3,
        hasLine: false,
        isActive: false,
        isComplete: false,
    },
];

export const INPUTS_NAMES = {
    NAME: "name",
    DESCRIPTION: "description",
    AVAILABLE_ON_BOTS: "available_on_bots",
    AVAILABLE_ON_CONNECT: "available_on_connect",
};
