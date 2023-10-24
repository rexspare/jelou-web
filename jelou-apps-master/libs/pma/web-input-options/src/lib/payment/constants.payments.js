export const ID_FIELD_CUSTOM_PAYMENT = {
    NAMES: "names",
    SURNAME: "surname",
    EMAIL: "email",
    LEGAL_ID: "legal_id",
    AMOUNT: "non_taxable_amount",
    DESCRIPTION: "name",
};

export const RECURRING_PAYMENT_NAMES = {
    NAMES: "names",
    PHONE: "phone",
    SURNAME: "surname",
    EMAIL: "email",
    LEGAL_ID: "legal_id",
    ADDRESS: "address",
    PLAN: "plan_ids",
};

export const PAYMENTS_TYPES = {
    PAYMENT: "payment",
    SUSCRIPTION: "suscription",
};

export const TYPE_INPUTS = {
    TEXT: "text",
    SELECTOR: "selector",
};

const SECONDS_IN_ONE_HOUR = 3600;
export const EXPIRY_TIME_LINK = SECONDS_IN_ONE_HOUR * 2;
