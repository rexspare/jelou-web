import { NOMENCLATURA } from "./motivosData";
import { CATEGORIA } from "./inboundData";
export const settings = [
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
        name: "observacion",
        label: "Observación",
        type: "textbox",
    },
];

export const outbound = [
    // {
    //     name: "nomenclatura",
    //     label: "Nomenclatura",
    //     type: "select",
    //     options: NOMENCLATURA,
    //     rules: {
    //         isObligatory: true,
    //         rules: "required",
    //     },
    // },
];

export const inbound = [
    // {
    //   name: 'categoria',
    //   label: 'Categoria',
    //   type: 'select',
    //   options: CATEGORIA,
    //   rules: {
    //     isObligatory: true,
    //     rules: 'required'
    //   }
    // }
];
export const subClassOutbound = [
    // {
    //     name: "motivos",
    //     label: "Motivos",
    //     rules: {
    //         isObligatory: true,
    //         rules: "required",
    //     },
    // },
];

export const subClassInbound = [
    // {
    //     name: "tipo",
    //     rules: {
    //         isObligatory: true,
    //         rules: "required",
    //     },
    // },
    // {
    //     name: "subtipo",
    //     rules: {
    //         isObligatory: true,
    //         rules: "required",
    //     },
    // },
    // {
    //     name: "motivo",
    //     rules: {
    //         isObligatory: true,
    //         rules: "required",
    //     },
    // },
    // {
    //     name: "resultado",
    //     rules: {
    //         isObligatory: true,
    //         rules: "required",
    //     },
    // },
];

export const extraSettings = [];
