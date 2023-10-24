import { ClockRevertIcon, PlusIconRounded, SearchIcon, TrashDelete } from "@builder/Icons";
import { ACTIONS_DATUM } from "@builder/modules/Nodes/Datum/domain/datum.domain";

export const BUTTONS_ACTIONS_DATUM = [
    {
        id: ACTIONS_DATUM.CREATE,
        label: "Crear registro",
    },
    {
        id: ACTIONS_DATUM.UPDATE,
        label: "Actualizar registro",
    },
    {
        id: ACTIONS_DATUM.DELETE,
        label: "Eliminar registro",
    },
    {
        id: ACTIONS_DATUM.SEARCH,
        label: "Buscar registro",
    },
];

export const ACTIONS_LABELS = {
    [ACTIONS_DATUM.CREATE]: "Creación de registro",
    [ACTIONS_DATUM.UPDATE]: "Actualizar registro",
    [ACTIONS_DATUM.DELETE]: "Eliminar registro",
    [ACTIONS_DATUM.SEARCH]: "Búsqueda de registro",
};

export const PATHS_ACTIONS_VERBS = {
    [ACTIONS_DATUM.CREATE]: "creo",
    [ACTIONS_DATUM.UPDATE]: "actualizó",
    [ACTIONS_DATUM.DELETE]: "eliminó",
    [ACTIONS_DATUM.SEARCH]: "encontró",
};

export const ACTIONS_ICONS = {
    [ACTIONS_DATUM.CREATE]: PlusIconRounded,
    [ACTIONS_DATUM.UPDATE]: ClockRevertIcon,
    [ACTIONS_DATUM.DELETE]: TrashDelete,
    [ACTIONS_DATUM.SEARCH]: SearchIcon,
};
