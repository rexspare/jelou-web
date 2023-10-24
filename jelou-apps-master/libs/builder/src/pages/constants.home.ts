export const SKILLS_QUERY_KEY = ["skills"];

export const CREATE_TOOLKIT_OPTION = {
    id: "create-toolkit",
    value: "create-toolkit",
    name: "Crear un nuevo toolkit",
    description: "Crea un nuevo toolkit para continuar",
    separator: true,
};

export const TOOLKIT_NAMES_INPUTS = {
    NAME: "name",
    DESCRIPTION: "description",
};

export const FILTER_ORDER_VALUES = {
    NAME_ASC: "name_asc",
    NAME_DESC: "name_desc",
    CREATED_AT_DESC: "created_at_desc",
    CREATED_AT_ASC: "created_at_asc",
};

export const FILTER_ORDER_OPTIONS = [
    {
        label: "Nombre A-Z",
        value: FILTER_ORDER_VALUES.NAME_ASC,
    },
    {
        label: "Nombre Z-A",
        value: FILTER_ORDER_VALUES.NAME_DESC,
    },
    {
        label: "Más recientes",
        value: FILTER_ORDER_VALUES.CREATED_AT_DESC,
    },
    {
        label: "Más antiguos",
        value: FILTER_ORDER_VALUES.CREATED_AT_ASC,
    },
];

export type FROM_PAGE_TYPE = "services" | "tool";

export enum FROM_PAGE {
    SERVICES = "services",
    TOOL = "tool",
}
