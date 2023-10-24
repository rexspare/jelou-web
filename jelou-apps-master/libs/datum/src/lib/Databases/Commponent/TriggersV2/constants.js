export const TRIGGER_VIEW = {
    NO_TRIGGERS: "NO_TRIGGERS",
    TRIGGERS: "TRIGGERS",
    CREATE_TRIGGER: "CREATE_TRIGGER",
}

export const TRIGGER_FIELDS_NAMES = {
    NAME: 'name',
    TYPE: 'type',
    URL: 'url',
    SUBSCRIPTIONS: 'subscriptions',
}

export const TRIGGER_ACTIONS = [
    {
        value: "http",
        label: {
            es: "Llamar a una URL",
            en: "Call a URL",
            pt: "Chamar uma URL",
        }
    },
]

export const TRIGGER_SORT_ORDERS = {
    ASC_NAME: "ASC_NAME",
    DESC_NAME: "DESC_NAME",
    ASC_DATE: "ASC_DATE",
    DESC_DATE: "DESC_DATE",
}

export const DEBOUNCE_STYLE = {
    width: "5rem",
    height: "3rem",
    resize: "none",
    color: "#727C94",
    fontSize: "1rem",
    borderRadius: "1.5em",
    padding: "1rem 0.5rem 1rem 2.5rem",
    border: "0.0625rem solid rgba(166, 180, 208, 0.60)",
}