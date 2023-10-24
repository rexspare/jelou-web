const servicesOptions = [
    { label: "Actualización de datos", value: "Actualización de datos" },
    { label: "Solicitud de crédito", value: "Solicitud de crédito" },
    { label: "Tarjetas de crédito", value: "Tarjetas de crédito" },
    { label: "Tarjetas de débito", value: "Tarjetas de débito" },
    { label: "Cuenta electrónica", value: "Cuenta electrónica" },
    { label: "Servicio Red Médica OSCUS", value: "Servicio Red Médica OSCUS" },
    { label: "Servicio OSCUS Online", value: "Servicio OSCUS Online" },
    { label: "Agencias y cajeros", value: "Agencias y cajeros" },
];

export const settings = [
    {
        id: "375afa98-a2a8-4225-a78e-78c0f8401079",
        label: "cédula",
        name: "legalId",
        rules: {
            isObligatory: true,
            rules: "required|max:10|min:10",
        },
        type: "text",
        show: "both",
        lock: false,
    },
    {
        id: "4f165b71-33f4-44eb-bd5f-09a8f4441f0f",
        label: "Código dactilar",
        name: "code",
        rules: { rules: "required", isObligatory: true },
        type: "text",
        show: "newClient",
        lock: false,
    },
    {
        id: "4f165b71-33f4-44eb-bd5f-09a8f4441f0f",
        label: "nombre de cliente",
        name: "name",
        rules: { rules: "", isObligatory: false },
        type: "text",
        show: "both",
        lock: true,
    },
    {
        id: "75a2cd44-2a62-4e29-87f8-49c7606261y9",
        label: "telefono",
        name: "phone",
        rules: { rules: "", isObligatory: false },
        type: "text",
        show: "both",
        lock: true,
    },
    {
        id: "75a2cd44-2a62-4e29-87f8-49c76062f109",
        label: "correo",
        name: "email",
        rules: { rules: "required|email", isObligatory: true },
        type: "text",
        show: "both",
        lock: true,
    },
    {
        id: "75a2cd44-2a62-4e29-87f8-49c760deddf101",
        label: "provincia",
        name: "province",
        rules: { rules: "required", isObligatory: true },
        type: "select",
        show: "both",
        lock: true,
    },
    {
        id: "75a2cd44-2a62-4e29-87f8-49c760deddf101",
        label: "ciudad",
        name: "city",
        rules: { rules: "required", isObligatory: true },
        type: "select",
        show: "both",
        lock: true,
    },
    {
        id: "75a2cd44-2a62-4e29-87f8-49c760deddf101",
        label: "parroquia",
        name: "parish",
        rules: { rules: "required", isObligatory: true },
        type: "select",
        show: "both",
        lock: true,
    },
    {
        id: "7b7d1e97-cd05-40e2-ac84-02f4595c3326",
        label: "Tipo de servicio",
        name: "service",
        options: servicesOptions,
        rules: { rules: "", isObligatory: false },
        type: "select",
        show: "both",
        lock: false,
    },
    {
        id: "fc9b76b1-4068-40d8-9a2c-fb0db0fac4ce",
        label: "observaciones",
        name: "observations",
        rules: { rules: "", isObligatory: false },
        type: "textbox",
        show: "both",
        lock: false,
    },
];