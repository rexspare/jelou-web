import { NOMENCLATURA } from "./motivosData";

export const settings = [
    {
        name: "cedula",
        label: "Cédula",
        type: "text",
        placeholder: "999999999",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "name",
        label: "Nombres",
        type: "text",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "telefono",
        label: "Teléfono",
        type: "text",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "email",
        label: "Correo electrónico",
        type: "text",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "ciudad",
        label: "Ciudad",
        type: "text",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "nomenclatura",
        label: "Nomenclatura",
        type: "select",
        options: NOMENCLATURA,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "observacion",
        label: "Observación",
        type: "textbox",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
];

export const extraSettings = [
    {
        name: "origenLead",
        label: "Origen Lead",
        type: "text",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
];

export const extraRules = [
    {
        name: "motivos",
        label: "Motivo",
        type: "select",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "maestria",
        label: "Maestria",
        type: "select",
        rules: {
            isObligatory: false,
            rules: "not required",
        },
    },
];
