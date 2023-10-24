import { ListBoxElement } from "@builder/common/Headless/Listbox";

export enum ERRORS_VALUES {
    GENERAL = "UNKNOWN_ERROR",
    OPERATOR_NOT_FOUND = "OPERATOR_NOT_FOUND",
    OPERATOR_NOT_IN_SCHEDULE = "OPERATORS_NOT_IN_SCHEDULER",
    OPERATOR_VIEW_NOT_ENABLED = "OPERATOR_VIEW_NOT_ENABLED",
    USER_IN_MANUAL_STATE = "USER_IN_MANUAL_STATE",
    OPERATOR_IN_LUNCHTIME = "OPERATOR_IN_LUNCHTIME",
    USER_NOT_IN_SESSION = "USER_NOT_IN_SESSION",
    TEAM_NOT_FOUND = "TEAM_NOT_FOUND",
}

export const ERRORS_PMA: ListBoxElement<ERRORS_VALUES>[] = [
    {
        value: ERRORS_VALUES.GENERAL,
        id: ERRORS_VALUES.GENERAL,
        name: "Error general",
        description: "",
    },
    {
        value: ERRORS_VALUES.OPERATOR_NOT_FOUND,
        id: ERRORS_VALUES.OPERATOR_NOT_FOUND,
        name: "Operador no encontrado",
        description: "",
    },
    {
        value: ERRORS_VALUES.OPERATOR_NOT_IN_SCHEDULE,
        id: ERRORS_VALUES.OPERATOR_NOT_IN_SCHEDULE,
        name: "Fuera de horario",
        description: "",
    },
    {
        value: ERRORS_VALUES.OPERATOR_VIEW_NOT_ENABLED,
        id: ERRORS_VALUES.OPERATOR_VIEW_NOT_ENABLED,
        name: "No se ha activado PMA",
        description: "",
    },
    {
        value: ERRORS_VALUES.USER_IN_MANUAL_STATE,
        id: ERRORS_VALUES.USER_IN_MANUAL_STATE,
        name: "Usuario ya está asignado",
        description: "",
    },
    {
        value: ERRORS_VALUES.OPERATOR_IN_LUNCHTIME,
        id: ERRORS_VALUES.OPERATOR_IN_LUNCHTIME,
        name: "Hora de almuerzo",
        description: "",
    },
    {
        value: ERRORS_VALUES.USER_NOT_IN_SESSION,
        id: ERRORS_VALUES.USER_NOT_IN_SESSION,
        name: "Usuario sin sesión activa",
        description: "",
    },
    {
        value: ERRORS_VALUES.TEAM_NOT_FOUND,
        id: ERRORS_VALUES.TEAM_NOT_FOUND,
        name: "Equipo no existe",
        description: "",
    },
];

export enum ASSIGNMENT_TYPE_NAMES {
    DIRECT = "direct",
    QUEUE = "queue",
}

export enum ASSIGNMENT_BY_NAMES {
    TEAM = "team",
    OPERATORS = "operators",
    GENERAL = "general",
    SHUFFLE = "shuffle",
}

export const LABELS_VALUES: { [key: string]: string } = {
    [ASSIGNMENT_TYPE_NAMES.DIRECT]: "Directa",
    [ASSIGNMENT_TYPE_NAMES.QUEUE]: "Cola",
    [ASSIGNMENT_BY_NAMES.TEAM]: "Equipo",
    [ASSIGNMENT_BY_NAMES.OPERATORS]: "Operadores",
    [ASSIGNMENT_BY_NAMES.GENERAL]: "General",
    [ASSIGNMENT_BY_NAMES.SHUFFLE]: "Aleatorio",
};

export enum INPUTS_NAME_PMA_CONFIG {
    TEAM_ID = "teamId",
    ASSIGNMENT_BY = "by",
    ASSIGNMENT_TYPE = "type",
    OPERATOR_ID = "operatorId",
}

export const ASSIGNMENT_TYPE_OPTIONS: ListBoxElement<ASSIGNMENT_TYPE_NAMES>[] = [
    {
        value: ASSIGNMENT_TYPE_NAMES.DIRECT,
        id: ASSIGNMENT_TYPE_NAMES.DIRECT,
        name: LABELS_VALUES[ASSIGNMENT_TYPE_NAMES.DIRECT],
        description: "La conversación se asigna de manera directa en la bandeja de entrada del operador",
    },
    {
        value: ASSIGNMENT_TYPE_NAMES.QUEUE,
        id: ASSIGNMENT_TYPE_NAMES.QUEUE,
        name: LABELS_VALUES[ASSIGNMENT_TYPE_NAMES.QUEUE],
        description: "La conversación se pone en la cola de espera. El operador puede asignar de manera manual los chats a su bandeja de entrada",
    },
];

export const ASSIGNMENT_BY_DIRECT_OPTIONS: ListBoxElement<ASSIGNMENT_BY_NAMES>[] = [
    {
        value: ASSIGNMENT_BY_NAMES.TEAM,
        id: ASSIGNMENT_BY_NAMES.TEAM,
        name: LABELS_VALUES[ASSIGNMENT_BY_NAMES.TEAM],
        description:
            "Permite escoger al equipo de asesores, que debe atender la conversación. Por defecto, tienen prioridad aquellos que cuentan con la menor cantidad de chats en su bandeja de entrada",
    },
    {
        value: ASSIGNMENT_BY_NAMES.OPERATORS,
        id: ASSIGNMENT_BY_NAMES.OPERATORS,
        name: LABELS_VALUES[ASSIGNMENT_BY_NAMES.OPERATORS],
        description: "Permite escoger al asesor que debe atender la conversación",
    },
    {
        value: ASSIGNMENT_BY_NAMES.SHUFFLE,
        id: ASSIGNMENT_BY_NAMES.SHUFFLE,
        name: LABELS_VALUES[ASSIGNMENT_BY_NAMES.SHUFFLE],
        description:
            "Se escoge de manera aleatoria al asesor que debe atender la conversación. Por defecto, tienen prioridad aquellos que cuentan con la menor cantidad de chats en su bandeja de entrada",
    },
];

export const ASSIGNMENT_BY_QUEUE_OPTIONS: ListBoxElement<ASSIGNMENT_BY_NAMES>[] = [
    {
        value: ASSIGNMENT_BY_NAMES.GENERAL,
        id: ASSIGNMENT_BY_NAMES.GENERAL,
        name: LABELS_VALUES[ASSIGNMENT_BY_NAMES.GENERAL],
        description: "Permite asignar las conversaciones de manera manual a cualquier operador",
    },
    {
        value: ASSIGNMENT_BY_NAMES.TEAM,
        id: ASSIGNMENT_BY_NAMES.TEAM,
        name: LABELS_VALUES[ASSIGNMENT_BY_NAMES.TEAM],
        description: "Permite asignar las conversaciones de manera manual a cualquier operador que corresponda al  equipo seleccionado",
    },
];

export const TYPES_INPUT_SELECTOR = "selector";
