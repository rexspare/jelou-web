export enum NODE_TYPES {
    START = "START",
    PMA = "PMA",
    MESSAGE = "CHANNEL_MESSAGE",
    HTTP = "HTTP",
    CODE = "CODE",
    IF_ERROR = "IF_ERROR",
    IF = "IF",
    INPUT = "INPUT",
    CONTEXT_MENU = "CONTEXT_MENU",
    END = "END",
    TOOL = "TOOL",
    NOTE = "NOTE",
    EMPTY = "EMPTY",
    TIMER = "PAUSE",
    CONDITIONAL = "CONDITIONAL",
    RANDOM = "RANDOM",
    SKILL = "SKILL",
    DATUM = "DATUM",
    MEMORY = "MEMORY",
}

export const NODE_TYPES_IDS: Record<NODE_TYPES, number> = {
    [NODE_TYPES.CONTEXT_MENU]: 0,
    [NODE_TYPES.START]: 1,
    [NODE_TYPES.PMA]: 2,
    [NODE_TYPES.MESSAGE]: 3,
    [NODE_TYPES.HTTP]: 4,
    [NODE_TYPES.CODE]: 5,
    [NODE_TYPES.IF_ERROR]: 6,
    [NODE_TYPES.IF]: 7,
    [NODE_TYPES.INPUT]: 8,
    [NODE_TYPES.END]: 9,
    [NODE_TYPES.TOOL]: 10,
    [NODE_TYPES.NOTE]: 11,
    [NODE_TYPES.EMPTY]: 12,
    [NODE_TYPES.TIMER]: 13,
    [NODE_TYPES.CONDITIONAL]: 14,
    [NODE_TYPES.RANDOM]: 15,
    [NODE_TYPES.SKILL]: 16,
    [NODE_TYPES.DATUM]: 17,
    [NODE_TYPES.MEMORY]: 18,
};

export const TITLE_NODES: Record<NODE_TYPES, string> = {
    [NODE_TYPES.CONTEXT_MENU]: "Context menu",
    [NODE_TYPES.START]: "Inicio",
    [NODE_TYPES.PMA]: "Conectar asesor",
    [NODE_TYPES.MESSAGE]: "Enviar mensaje",
    [NODE_TYPES.HTTP]: "API",
    [NODE_TYPES.CODE]: "Code",
    [NODE_TYPES.IF_ERROR]: "Si error",
    [NODE_TYPES.IF]: "Si",
    [NODE_TYPES.INPUT]: "Pregunta",
    [NODE_TYPES.END]: "End",
    [NODE_TYPES.TOOL]: "Tool",
    [NODE_TYPES.NOTE]: "Sticky Note",
    [NODE_TYPES.EMPTY]: "Nuevo paso",
    [NODE_TYPES.TIMER]: "Pausa",
    [NODE_TYPES.CONDITIONAL]: "Condicional",
    [NODE_TYPES.RANDOM]: "Aleatorio",
    [NODE_TYPES.SKILL]: "Skill",
    [NODE_TYPES.DATUM]: "Datum",
    [NODE_TYPES.MEMORY]: "Variable",
};