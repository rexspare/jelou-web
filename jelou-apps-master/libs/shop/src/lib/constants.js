import { t } from "i18next";

export const INPUTS_NAMES = {
    NAME: "name",
    SKU: "sku",
    DESCRIPTION: "description",
    PRICE: "price",
    STOCK_TYPE: "stock_type",
    STOCK: "stock",
    CATEGORIES: "categories[]",
    HAS_TAX: "has_tax",
    DISCOUNT_TYPE: "discount_type",
    DISCOUNT: "discount",
    IMAGES: "images[]",
    AVAILABLE_AT: "available_at",
    EXPIRES_AT: "expires_at",
};

export const stockTypes = [
    {
        label: t("shop.modal.unlimited"),
        value: "unlimited",
    },
    {
        label: t("shop.modal.limited"),
        value: "limited",
    },
];

export const descuentoOptions = [
    {
        label: t("shop.selectOptions.none"),
        value: "empty",
    },
    {
        label: t("shop.selectOptions.value"),
        value: "value",
    },
    {
        label: t("shop.selectOptions.percentage"),
        value: "percentage",
    },
];

export const taxOptions = [
    {
        label: t("shop.selectOptions.yes"),
        value: 1,
    },
    {
        label: t("shop.selectOptions.no"),
        value: 0,
    },
];

export const INPUTS_TYPES = {
    TEXT: "text",
    SELECT: "select",
    IMAGE: "image",
    CHECKBOX: "checkbox",
    NUMBER: "number",
};

export const NAME_INPUTS_CATEGORY = {
    NAME: "name",
    DESCRIPTION: "description",
};

export const INPUTS_LIST_CATEGORIES = [
    {
        label: t("common.name"),
        name: NAME_INPUTS_CATEGORY.NAME,
        type: INPUTS_TYPES.TEXT,
        placeholder: t("shop.nameCategory"),
    },
    {
        label: t("common.description"),
        name: NAME_INPUTS_CATEGORY.DESCRIPTION,
        type: INPUTS_TYPES.TEXT,
        placeholder: t("shop.categoryDescr"),
    },
];

export const NAME_INPUTS_SUBSCRIPTIONS = {
    NAME: "name",
    DESCRIPTION: "description",
    PRICE: "price",
    SIGNUP_FEE: "signup_fee",
    CURRENCY: "currency",
    INVOICE_PERIOD: "invoice_period",
    INVOICE_INTERVAL: "invoice_interval",
};

export const INPUTS_LIST_SUBSCRIPTIONS = [
    {
        label: t("shop.plans.create.name"),
        name: NAME_INPUTS_SUBSCRIPTIONS.NAME,
        type: INPUTS_TYPES.TEXT,
        placeholder: t("shop.plans.create.namePlaceholder"),
    },
    {
        label: t("shop.plans.create.description"),
        name: NAME_INPUTS_SUBSCRIPTIONS.DESCRIPTION,
        type: INPUTS_TYPES.TEXT,
        placeholder: t("shop.plans.create.descriptionPlaceholder"),
    },
    {
        label: t("shop.plans.create.price"),
        name: NAME_INPUTS_SUBSCRIPTIONS.PRICE,
        type: INPUTS_TYPES.NUMBER,
        placeholder: t("shop.plans.create.pricePlaceholder"),
    },
    {
        label: t("shop.plans.create.currency"),
        name: NAME_INPUTS_SUBSCRIPTIONS.CURRENCY,
        type: INPUTS_TYPES.SELECT,
        placeholder: t("shop.plans.create.currencyPlaceholder"),
    },
    {
        label: t("shop.plans.create.interval"),
        name: NAME_INPUTS_SUBSCRIPTIONS.INVOICE_INTERVAL,
        type: INPUTS_TYPES.SELECT,
        placeholder: t("shop.plans.create.intervalPlaceholder"),
    },
    {
        label: t("shop.plans.create.period"),
        name: NAME_INPUTS_SUBSCRIPTIONS.INVOICE_PERIOD,
        type: INPUTS_TYPES.NUMBER,
        placeholder: t("shop.plans.create.periodPlaceholder"),
    },
    {
        label: t("shop.plans.create.signupFee"),
        name: NAME_INPUTS_SUBSCRIPTIONS.SIGNUP_FEE,
        type: INPUTS_TYPES.NUMBER,
        placeholder: t("shop.plans.create.signupFeePlaceholder"),
    },
];

export const IMAGES_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export const STATUS_ORDERS = {
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    CANCELED: "canceled",
};

export const REFECT_INTERVAL_ORDERS = 1000 * 30; // 30 seconds

export const STEPS_IDS = {
    PRINCIPAL_DATA: "PRINCIPAL_DATA",
    IMAGES: "IMAGES",
    PRICES: "PRICES",
    DATES: "DATES",
};

export const INIT_STEPS_LIST = [
    {
        id: STEPS_IDS.PRINCIPAL_DATA,
        title: {
            es: "Datos principales",
            en: "Principal data",
            pt: "Dados principais",
        },
        number: 1,
        isActive: true,
        hasLine: true,
        isComplete: false,
    },
    {
        id: STEPS_IDS.IMAGES,
        title: {
            es: "Subir imágenes",
            en: "Upload images",
            pt: "Carregar imagens",
        },
        number: 2,
        isActive: false,
        hasLine: true,
        isComplete: false,
    },
    {
        id: STEPS_IDS.PRICES,
        title: {
            es: "Precios adicionales",
            en: "Additional prices",
            pt: "Preços adicionais",
        },
        number: 3,
        isActive: false,
        hasLine: true,
        isComplete: false,
    },
    {
        id: STEPS_IDS.DATES,
        title: {
            es: "Vigencia del producto",
            en: "Product validity",
            pt: "Validade do produto",
        },
        number: 4,
        isActive: false,
        hasLine: false,
        isComplete: false,
    },
];

export const INVOICE_INTERVALS = [
    {
        value: "month",
        label: t("shop.plans.interval.month"),
    },
    {
        value: "year",
        label: t("shop.plans.interval.year"),
    },
];

export const CURRENCIES = [
    {
        value: "USD",
        label: t("shop.plans.currencies.USD"),
    },
    {
        value: "CLP",
        label: t("shop.plans.currencies.CLP"),
    },
    {
        value: "PEN",
        label: t("shop.plans.currencies.PEN"),
    },
];

export const NAME_PRICES_INPUTS = {
    VALUE: "value",
    CURRENCY: "currency",
    ISEDIT: "isEdit",
    ISSAVED: "isSaved",
    PRICE_GROUP_TAGS: "price_group_tags",
};

export const VALUE_EMPTY_DISCOUNT = "empty";

export const KEY_CATEGOIES_IS_UPDATE = "categories";

export const TAGS_QUERY_KEY = "tags";

export const PRICE_ACTION = {
    ADD: "ADD",
    EDIT: "EDIT",
};
