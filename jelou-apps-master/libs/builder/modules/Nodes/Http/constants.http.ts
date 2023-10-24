import { v4 } from "uuid";
import { HttpForm } from "./http.domain";

export enum CONTENT_TYPE_TYPES {
    JSON = "application/json",
    XML = "application/xml",
    TEXT = "text/plain",
    MULTIPART_FORM = "multipart/form-data",
    FORM_URL_ENCODED = "application/x-www-form-urlencoded",
    NO_CONTENT = "no-content",
}

export enum AUTH_TYPES {
    BASIC = "basic",
    // OAUTH1 = "oauth1",
    // OAUTH2 = "oauth2",
    BEARER_TOKEN = "bearer",
    NO_AUTH = "no-auth",
}

export enum HTTP_INPUTS_NAMES {
    URL = "url",
    METHOD = "method",
    OUTPUT = "output",
    CONTENT_TYPE = "type",
    MULTIPART_FORM_KEY = "key",
    MULTIPART_FORM_VALUE = "value",
    MULTIPART_FORM_CHECKBOX = "enabled",
}

export enum HTTP_NAMES_ID {
    BODY = "body",
    AUTH = "autenticacion",
    QUERY = "query",
    HEADERS = "headers",
    SETTINGS = "settings",
}

export enum HTTP_METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
}

export const INITIAL_STATE_MULTIPART_FORM: HttpForm[] = [
    {
        id: v4(),
        key: "",
        value: "",
        enabled: true,
    },
];

export const HTTP_METHODS_OPTIONS = [
    {
        label: "GET",
        value: HTTP_METHODS.GET,
    },
    {
        label: "POST",
        value: HTTP_METHODS.POST,
    },
    {
        label: "PUT",
        value: HTTP_METHODS.PUT,
    },
    {
        label: "DELETE",
        value: HTTP_METHODS.DELETE,
    },
    {
        label: "PATCH",
        value: HTTP_METHODS.PATCH,
    },
];

export const AUTH_TYPES_OPTIONS = [
    {
        label: "No Auth",
        value: AUTH_TYPES.NO_AUTH,
    },
    {
        label: "Basic",
        value: AUTH_TYPES.BASIC,
    },
    // {
    //   label: 'OAuth1',
    //   value: AUTH_TYPES.OAUTH1
    // },
    // {
    //   label: 'OAuth2',
    //   value: AUTH_TYPES.OAUTH2
    // },
    {
        label: "Bearer Token",
        value: AUTH_TYPES.BEARER_TOKEN,
    },
];

export const contentTypeBodyOptions = [
    {
        label: "No Content",
        value: CONTENT_TYPE_TYPES.NO_CONTENT,
    },
    {
        label: "JSON",
        value: CONTENT_TYPE_TYPES.JSON,
    },
    {
        label: "XML",
        value: CONTENT_TYPE_TYPES.XML,
    },
    {
        label: "Texto",
        value: CONTENT_TYPE_TYPES.TEXT,
    },
    {
        label: "Multipart Form",
        value: CONTENT_TYPE_TYPES.MULTIPART_FORM,
    },
    {
        label: "Form URL Encoded",
        value: CONTENT_TYPE_TYPES.FORM_URL_ENCODED,
    },
];

export const titleList = [
    {
        id: HTTP_NAMES_ID.BODY,
        label: "Body",
        type: "",
    },
    {
        id: HTTP_NAMES_ID.AUTH,
        label: "Autenticación",
        type: "",
    },
    {
        id: HTTP_NAMES_ID.QUERY,
        label: "Query",
        type: "",
    },
    {
        id: HTTP_NAMES_ID.HEADERS,
        label: "Headers",
        type: "",
    },
    {
        id: HTTP_NAMES_ID.SETTINGS,
        label: "Settings",
        type: "",
    },
];

export const HTTP_HEADER_KEY_NAME = "Content-type";

export enum HTTP_SETTINGS_NAMES {
    SSL = "sslCertificate",
    TIMEOUT = "timeout",
}

export enum HTTP_SETTINGS_RETRY_OPTIONS_NAMES {
    RETRIES = "retries",
    ENABLE_RETRIES = "enabled",
    TIME_BETWEEN_RQ = "milliseconds",
    SHOULD_RESET_TIMEOUT = "shouldResetTimeout",
    RETRY_CONDITION = "retryCondition",
    RETRY_DELAY = "retryDelay",
}

export enum RETRY_CONTION {
    is_network_or_idempotent_request_error = "is_network_or_idempotent_request_error",
    always_retry = "always_retry",
}

export const RETRY_CONDITION_OPTIONS = [
    {
        label: "Is network or idempotent request error",
        value: RETRY_CONTION.is_network_or_idempotent_request_error,
    },
    {
        label: "Always retry",
        value: RETRY_CONTION.always_retry,
    },
];

export enum RETRY_DELAY {
    no_delay = "no_delay",
    exponential_delay = "exponential_delay",
    custom_delay = "custom_delay",
}

export const RETRY_DELAY_OPTIONS = [
    {
        label: "No delay",
        value: RETRY_DELAY.no_delay,
    },
    {
        label: "Exponential delay",
        value: RETRY_DELAY.exponential_delay,
    },
    {
        label: "Custom delay",
        value: RETRY_DELAY.custom_delay,
    },
];

export enum HTTP_SETTINGS_PROXY_OPTIONS_NAMES {
    ENABLE_PROXY = "enabled",
    PROXY_OPTIONS = "proxyOptions",
}

export const PROXY_OPTIONS_NAMES = [
    {
        protocol: "https",
        ip: "74.80.255.164",
        host: null,
        port: "50100",
        auth: {
            username: "soporte0ZfVQ",
            password: "EigN5IMsRD",
        },
    },
];

export const PROXY_OPTIONS = [
    {
        label: "🇺🇸 US ~ Host ~ 74.80.255.164",
        value: PROXY_OPTIONS_NAMES[0],
    },
];
