import { ciudades } from "./CRMData";

const teamShow = {
    NONE: "NONE",
    ACTUAL: "ACTUAL",
    NUEVO: "NUEVO",
    BOTH: "BOTH",
};

export const settings = [
    {
        name: "RUC",
        label: "RUC",
        type: "text",
        team: teamShow.NUEVO,
        rules: {
            isObligatory: true,
            rules: "required|max:13|min:13",
        },
    },
    {
        name: "RazonSocial",
        label: "Razón social",
        type: "text",
        team: teamShow.NUEVO,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "MID",
        label: "mid",
        type: "text",
        team: teamShow.ACTUAL,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "TID",
        label: "TID",
        type: "text",
        team: teamShow.ACTUAL,
    },
    {
        name: "Nombre",
        label: "Nombre",
        type: "text",
        team: teamShow.BOTH,
        rules: {
            isObligatory: true,
            rules: "required|max:50",
        },
    },
    {
        name: "Apellido",
        label: "Apellido",
        type: "text",
        team: teamShow.BOTH,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "Telefono",
        label: "Teléfono convencional",
        type: "text",
        team: teamShow.BOTH,
        rules: {
            isObligatory: true,
            rules: "required|max:9|min:9",
        },
    },
    {
        name: "Celular",
        label: "Teléfono Celular",
        type: "text",
        team: teamShow.BOTH,
        rules: {
            isObligatory: true,
            rules: "required|max:10|min:10",
        },
    },
    {
        name: "Correo",
        label: "Correo electrónico",
        type: "text",
        team: teamShow.BOTH,
        rules: {
            isObligatory: true,
            rules: "required|email",
        },
    },
    {
        name: "canton",
        label: "Ciudad",
        type: "select",
        options: ciudades,
        team: teamShow.BOTH,
    },
    {
        name: "CategoriaCRM",
        label: "Categoría de Gestión",
        type: "select",
        team: teamShow.BOTH,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "Producto",
        label: "Producto",
        type: "select",
        team: teamShow.BOTH,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "Descripcion",
        label: "Descripción",
        type: "textbox",
        team: teamShow.BOTH,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "Direccion",
        label: "Direccion",
        type: "text",
        team: teamShow.NONE,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "RucEnMora",
        label: "RUC en mora",
        type: "text",
        team: teamShow.NONE,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "Origen",
        label: "Origen",
        type: "text",
        team: teamShow.NONE,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "Contacto",
        label: "Contacto",
        type: "text",
        team: teamShow.NONE,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "Segmento",
        label: "Segmento",
        type: "select",
        options: [
            { value: "VIP", label: "VIP" },
            { value: "General", label: "General" },
        ],
        team: teamShow.ACTUAL,
    },
    {
        name: "Horario",
        label: "Horario de atención",
        type: "textbox",
        team: teamShow.ACTUAL,
    },
];
