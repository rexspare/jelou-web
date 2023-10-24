import { ExitIcon } from "@apps/shared/icons";
import dayjs from "dayjs";
import { t } from "i18next";

export const BASE_URI = "https://api.jelou.ai/v2";

export const homeTabReport = "/datum/reports";
export const homeTabDatabases = "/datum/databases";
export const homeTabDatum = "/datum";
export const USERS_EL_ROSADO = {
  "craymond@elrosado.com": 5112,
  "gczarnin@elrosado.com": 5113,
  "vpenafiel@elrosado.com": 5109,
}
export const DATA_BASE_EL_ROSADO = 647;

export const TYPES_COLUMN = {
    integer: "integer",
    boolean: "boolean",
    double: "double",
    text: "text",
    keyword: "keyword",
    date: "date",
    dateTime: "date-time",
    time: "time",
    file: "file_url",

    // faltan homologar en la traducion para ser mostrados en la creacion de la DB
    flattened: "flattened",
    nested: "nested",
    object: "object",
};

export const FORMAT_DATE = {
    date: "YYYY-MM-DD",
    "date-time": "YYYY-MM-DDTHH:mm:ss",
    time: "HH:mm:ss",
};

export const FORMAT_DATE_RENDER = {
    date: "YYYY-MM-DD",
    "date-time": "YYYY-MM-DD HH:mm:ss",
    time: "HH:mm:ss",
};

// search’,‘date’,‘options’,‘
export const INTERNAL_FILTERS_TYPES = {
    SEARCH: "search",
    DATE: "date",
    OPTIONS: "options",
};

export const TYPES_FILTER = {
    boolean: INTERNAL_FILTERS_TYPES.OPTIONS,
    keyword: INTERNAL_FILTERS_TYPES.OPTIONS,
    integer: INTERNAL_FILTERS_TYPES.SEARCH,
    text: INTERNAL_FILTERS_TYPES.SEARCH,
    double: INTERNAL_FILTERS_TYPES.SEARCH,
    date: INTERNAL_FILTERS_TYPES.DATE,
};

export const NAMES_FILTERS = {
    [INTERNAL_FILTERS_TYPES.SEARCH]: "Buscar",
    [INTERNAL_FILTERS_TYPES.DATE]: "Fecha",
    [INTERNAL_FILTERS_TYPES.OPTIONS]: "Opciones",
};

export const INPUTS_KEYS = {
    nameDatabase: "nameDatabase",
    nameColumn: "nameColumn",
    typeColumn: "typeColumn",
    descriptionColumn: "descriptionColumn",
    nameFilter: "nameFilter",
    options: "optionsKeyword",
};

// ‘flattened’,‘nested’,‘object’ -> missing

export const FILTERS_INPUTS = [
    { label: t("datum.typeColumn.boolean"), value: "boolean" }, // =>options
    { label: t("datum.typeColumn.keyword"), value: "keyword" }, // -> options

    { label: t("datum.typeColumn.text"), value: "text", hasFilter: true }, // -> search
    { label: t("datum.typeColumn.integerText"), value: "text", hasFilter: true }, // -> search
    { label: t("datum.typeColumn.double"), value: "double", hasFilter: true }, //-> search

    { label: t("datum.typeColumn.date"), value: "date", hasFilter: true }, // -> date

    // filter disabled
    { label: t("datum.typeColumn.date-time"), value: "date-time", hasFilter: false },
    { label: t("datum.typeColumn.time"), value: "time", hasFilter: false },
    { label: t("datum.typeColumn.file_url"), value: "file_url", hasFilter: false },
];

export const OPTIONS_INPUT_BOOLEAN = [
    { label: "True", value: true },
    { label: "False", value: false },
];

export const booleanOptions = [
    {
        name: "true",
        value: "true",
        order: 0,
    },
    {
        name: "false",
        value: "false",
        order: 1,
    },
];

export const HOURS = [
    { value: "00", label: "00" },
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
    { value: "06", label: "06" },
    { value: "07", label: "07" },
    { value: "08", label: "08" },
    { value: "09", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
];

export const MINUTES = [
    { value: "00", label: "00" },
    { value: "15", label: "15" },
    { value: "30", label: "30" },
    { value: "45", label: "45" },
    { value: "55", label: "55" },
];

export const RENDER_TYPE_COLUMN = {
    [TYPES_COLUMN.file]: (data) => {
        const urlsArray = data.split(",");
        return (
            <ul>
                {urlsArray.map((link) => {
                    return (
                        <li key={link}>
                            <a href={link} rel="noreferrer" target="_blank" className="flex items-center gap-2 text-primary-200 hover:underline">
                                {t("datum.seeDocument")}
                                <ExitIcon width={10} height={10} />
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    },
    [TYPES_COLUMN.time]: (data) => <span>{data}</span>,
    [TYPES_COLUMN.boolean]: (data) => <span>{data ? "true" : "false"}</span>,
    [TYPES_COLUMN.date]: (data) => {
        const valueRender = dayjs(data).format(FORMAT_DATE_RENDER.date);
        return <span>{valueRender}</span>;
    },
    [TYPES_COLUMN.dateTime]: (data) => {
        const valueRender = dayjs(data).format(FORMAT_DATE_RENDER["date-time"]);
        return <span>{valueRender}</span>;
    },
    [TYPES_COLUMN.object]: () => {
        return <span>{t("Objeto muy largo")}</span>;
    },
    [TYPES_COLUMN.flattened]: () => {
        return <span>{t("Objeto muy largo")}</span>;
    },
    [TYPES_COLUMN.nested]: () => {
        return <span>{t("Objeto muy largo")}</span>;
    },
};

export const RENDER_SEE_COLUMN = {
    [TYPES_COLUMN.dateTime]: (key, id, name, rowSeletec) => (
        <p key={key + id}>
            {name}: <span className="font-normal">{dayjs(rowSeletec[key]).format("YYYY-MM-DD HH:mm")}</span>
        </p>
    ),
    [TYPES_COLUMN.file]: (key, id, name, rowSeletec, renderImg) => {
        const urls = rowSeletec[key] ?? "";
        const urlArray = urls.split(",");
        return (
            <ul key={key + id} className="grid gap-3">
                {name}
                {urlArray &&
                    urlArray.map((link) => {
                        const extensionFile = link.split("-.")[1];
                        const IconFile = renderImg({ type: extensionFile, link, size: "30" });
                        return (
                            <li key={link} className="flex items-center gap-2">
                                <IconFile />
                                <a
                                    target={"_blank"}
                                    rel="noreferrer"
                                    href={link}
                                    className="flex items-center gap-2 font-normal text-primary-200 hover:underline">
                                    {t("datum.seeDocument")}
                                    <ExitIcon width={10} height={10} />
                                </a>
                            </li>
                        );
                    })}
            </ul>
        );
    },
    [TYPES_COLUMN.object]: (key, id, name, rowSeletec) => (
        <p key={key + id}>
            {name}: <span className="font-normal">{t("Objeto muy largo")}</span>
        </p>
    ),
    [TYPES_COLUMN.flattened]: (key, id, name, rowSeletec) => (
        <p key={key + id}>
            {name}: <span className="font-normal">{t("Objeto muy largo")}</span>
        </p>
    ),
    [TYPES_COLUMN.nested]: (key, id, name, rowSeletec) => (
        <p key={key + id}>
            {name}: <span className="font-normal">{t("Objeto muy largo")}</span>
        </p>
    ),
};

export const ACTION_MODALS = {
    UPDATE: "update",
    CREATE: "create",
    DELETE: "delete",
};

// Bulk data load modal steps

export const STEPS_IDS = {
    FILE_UPLOAD: "FILE_UPLOAD",
    COLUMN_MATCH: "COLUMN_MATCH",
    DATA_PREVIEW: "DATA_PREVIEW",
};
export const INIT_STEPS_LIST = [
    {
        id: STEPS_IDS.FILE_UPLOAD,
        title: "datum.fromAFile",
        number: 1,
        isActive: true,
        hasLine: true,
        isComplete: false,
    },
    {
        id: STEPS_IDS.COLUMN_MATCH,
        title: "datum.uploadModal.colMatch",
        number: 2,
        isActive: false,
        hasLine: true,
        isComplete: false,
    },
    {
        id: STEPS_IDS.DATA_PREVIEW,
        title: "common.preview",
        number: 3,
        isActive: false,
        hasLine: false,
        isComplete: false,
    },
];

// Max number of rows of a file allowed to upload in a database

export const FILE_SIZE_MAX = 50000000; // 50000000 bytes -> 50mb

export const DATABASE_NAME_MAX_CHARACTERS = 50;
export const DATABASE_DESCRIPTION_MAX_CHARACTERS = 255;

// Bulk data load Excel datum types

export const DATUM_TYPES = {
    NUMBER: "number",
    STRING: "string",
    UNKNOWN: "unknown",
    EMPTY: "empty"
}

// Days between 01/01/1900 (Excel) and 01/01/1970 (Javascript)

export const DAYS_TO_ADJUST = 25567 + 1;

// Number of miliseconds in a day

export const MIL_SECS_PER_DAY = 24 * 60 * 60 * 1000;

export const ENDPOINT = 'https://beautiful-snowflake-ncfxriqw9asr.vapor-farm-f1.com/api/v1/import/preview/';
export const MILISECONDS = 1000;
export const MILISECONDS_EXTRA = 20000;
export const INTERVAL_TIME = 3000;
