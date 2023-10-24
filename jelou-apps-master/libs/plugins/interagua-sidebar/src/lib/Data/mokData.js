import { tipoDeLlamada } from "./tipoLlamadaData";

export const settings = [
    {
        name: "contrato",
        label: "Contrato",
        type: "text",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "cedula",
        label: "Cédula",
        type: "text",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "celular",
        label: "Celular",
        type: "text",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },

    {
        name: "tipoDeLlamada",
        label: "Tipo de llamada",
        type: "select",
        options: tipoDeLlamada,
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
    {
        name: "observacion",
        label: "Observación",
        type: "textbox",
    },
];

export const extraRules = [
    {
        name: "Tipologia",
        label: "Tipología",
        type: "select",
        rules: {
            isObligatory: true,
            rules: "required",
        },
    },
];
