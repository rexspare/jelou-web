export const NOMENCLATURA = [
    { value: "aceptacion", label: "ACEPTACION" },
    { value: "pendienteDeAceptacion", label: "PENDIENTE DE ACEPTACION" },
    { value: "noAceptacion", label: "NO ACEPTACION" },
    { value: "noContactoNoJustificado", label: "NO CONTACTO NO JUSTIFICADO" },
];

export const MOTIVOS = {
    aceptacion: [
        { label: "Con pago", value: "CON-PAGO" },
        { label: "Sin pago - Pendiente de financiamiento", value: "SIN-PAGO-PENDIENTE-DE-FINANCIAMIENTO" },
        {
            label: "Sin pago con deuda al banco",
            value: "SIN-PAGO-CON-DEUDA-AL-BANCO",
        },
        {
            label: "Sin pago con tarjeta de crédito",
            value: "SIN-PAGO-CON-TARJETA-DE-CREDITO",
        },
        {
            label: "Completado - en espera de resultado trámite",
            value: "COMPLETADO-EN-ESPERA-DE-RESULTADO-TRAMITE",
        },
    ],
    pendienteDeAceptacion: [
        {
            label: "Pendiente de documentación",
            value: "PENDIENTE-DE-DOCUMENTACIÓN",
        },
        {
            label: "Necesita verificar precios",
            value: "NECESITA-VERIFICAR-PRECIOS",
        },
        {
            label: "Acept costos pendiente tc discovery",
            value: "ACEPT-COSTOS-PENDIENTE-TC-DISCOVERY",
        },
        {
            label: "Escalado a Mst.",
            value: "ESCALADO-A-MST",
        },
        {
            label: "Necesita leer la inf.",
            value: "NECESITA-LEER-LA-INFORMACION",
        },
        {
            label: "Necesita consultar con su familia",
            value: "NECESITA-CONSULTAR-CON-SU-FAMILIA",
        },
        { label: "Continuará por si solo", value: "CONTINUARA-POR-SI-SOLO" },
    ],
    noAceptacion: [
        {
            label: "Actualmente estudia Maestría en UTPL",
            value: "ACTUALMENTE-ESTUDIA-MAESTRIA-EN-UTPL",
        },
        {
            label: "Aún estudia Pregrado",
            value: "AUN-ESTUDIA-PREGRADO",
        },
        {
            label: "Carreras ofertadas no son las que desea",
            value: "CARRERAS-OFERTADAS-NO-SON-LAS-QUE-DESEA",
        },
        {
            label: "Cuenta con título de tecnólogo",
            value: "CUENTA-CON-TITULO-DE-TECNOLOGO",
        },
        {
            label: "Falta de tiempo",
            value: "FALTA-DE-TIEMPO",
        },
        {
            label: "Información para un familiar",
            value: "INFORMACION-PARA-UN-FAMILIAR",
        },
        {
            label: "No cuenta con dinero",
            value: "NO-CUENTA-CON-DINERO",
        },
        {
            label: "No desea estudiar a distancia",
            value: "NO-INTERESADO-EN-MODALIDAD-DISTANCIA",
        },
        {
            label: "No cumple con el perfil",
            value: "NO-CUMPLE-CON-EL-PERFIL",
        },
        {
            label: "Problemas de salud",
            value: "PROBLEMAS-DE-SALUD",
        },
        {
            label: "No desea continuar con el proceso",
            value: "NO-DESEA-CONTINUAR-CON-EL-PROCESO",
        },
        {
            label: "Trabaja en UTPL",
            value: "TRABAJA-EN-UTPL",
        },
        {
            label: "No interesado en modalidad presencial",
            value: "NO-INTERESADO-EN-MODALIDAD-PRESENCIAL",
        },
        {
            label: "Ya se encuentra estudiando en otra universidad",
            value: "YA-SE-ENCUENTRA-ESTUDIANDO-EN-OTRA-UNIVERSIDAD",
        },
    ],
    noContactoNoJustificado: [
        {
            label: "No contesta",
            value: "NO-CONTESTA",
        },
    ],
};
