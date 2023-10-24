import { Http } from "@builder/modules/Nodes/Http/http.domain";

export enum CURL_KEYS {
    REQUEST = "request",
    URL = "url",
    URL_LOCATION = "location",
    HEADER = "header",
    HEADER_H = "H",
    DATA = "data",
    DATA_RAW = "data-raw",
    METHOD = "method",
    METHOD_X = "X",
    PARAMS = "queryParams",
}

export type CurlData = {
    [CURL_KEYS.HEADER]: {
        [key: string]: string;
    };
    [CURL_KEYS.DATA]: {
        [key: string]: string;
    };
    [CURL_KEYS.PARAMS]: {
        [key: string]: string;
    };
    [CURL_KEYS.METHOD]: string;
    [CURL_KEYS.URL]: string;
};

export type ConfigHttpType = {
    header: Http["configuration"]["headers"];
    data: Http["configuration"]["body"];
    queryParams: Http["configuration"]["parameters"];
    url: Http["configuration"]["url"];
};

type ObjectToCurl = {
    header: Record<string, string>;
    data: string;
    // queryParams: Record<string, string>;
    method: string;
    url: string;
};

export const parseCurl = (curl: string) => {
    if (typeof curl !== "string") {
        throw new Error("curl must be a string");
    }

    const data: CurlData = {
        [CURL_KEYS.HEADER]: {},
        [CURL_KEYS.DATA]: {},
        [CURL_KEYS.PARAMS]: {},
        [CURL_KEYS.METHOD]: "",
        [CURL_KEYS.URL]: "",
    };

    const curlArray = curl.replace(/\\/g, "").split(/(?<![a-zA-Z0-9])-{1,2}/);

    curlArray.forEach((curlRow) => {
        const row = curlRow.trim();
        if (row.startsWith(CURL_KEYS.METHOD) || row.startsWith(CURL_KEYS.METHOD_X) || row.startsWith(CURL_KEYS.REQUEST)) {
            const method = row.split(" ")[1].replace(/'/g, "");
            data[CURL_KEYS.METHOD] = method;
        }

        if (row.startsWith(CURL_KEYS.URL) || row.startsWith(CURL_KEYS.URL_LOCATION) || row.startsWith("curl 'https://")) {
            const url = row.split(" ")[1].replace(/'/g, "");
            let urlObject = null;

            try {
                urlObject = new URL(url);
                const params = Object.fromEntries(urlObject.searchParams.entries());
                const cleanUrl = urlObject.origin + urlObject.pathname;

                data[CURL_KEYS.PARAMS] = params;
                data[CURL_KEYS.URL] = cleanUrl;
            } catch (error) {
                data[CURL_KEYS.URL] = url;
                curl.includes(CURL_KEYS.DATA) || curl.includes(CURL_KEYS.DATA_RAW) ? (data[CURL_KEYS.METHOD] = "POST") : (data[CURL_KEYS.METHOD] = "GET");
            }
        }

        if (row.startsWith(CURL_KEYS.HEADER) || row.startsWith(CURL_KEYS.HEADER_H)) {
            const [key, value] = row
                .replace(/'/g, "")
                .replace(CURL_KEYS.HEADER, "")
                .replace("H ", "")
                .split(":")
                .map((h) => h.trim());

            data[CURL_KEYS.HEADER] = {
                ...data[CURL_KEYS.HEADER],
                [key]: value,
            };
        }

        if (row.startsWith(CURL_KEYS.DATA_RAW) || row.startsWith(CURL_KEYS.DATA)) {
            const isRaw = row.startsWith(CURL_KEYS.DATA_RAW);
            const clearRow = isRaw ? row.replace(CURL_KEYS.DATA_RAW, "") : row.replace(CURL_KEYS.DATA, "");
            const rowData = clearRow.trim().replace(/'/g, "");

            data[CURL_KEYS.DATA] = rowData.startsWith("{") ? JSON.parse(rowData) : rowData;
        }
    });

    return data;
};

export const objectToCurl = ({ header = {}, data = "", method = "", url = "" }: ObjectToCurl) => {
    if (!method || !url || !/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/i.test(method)) {
        throw new Error("Invalid curlData object");
    }

    const curlParts = [];

    // Add request method
    curlParts.push(`curl -X ${method.toUpperCase()}`);

    // Add headers
    for (const [key, value] of Object.entries(header)) {
        curlParts.push(`-H '${key}: ${value}'`);
    }

    // Add data
    if (data) {
        if (method.toUpperCase() === "GET") {
            console.warn("Data is not applicable for GET requests in cURL.");
        } else {
            curlParts.push(`--data '${data}'`);
        }
    }

    // Add URL
    // let urlWithParams = url;
    // const params = new URLSearchParams(queryParams);
    // if (Object.keys(queryParams).length > 0) {
    //   urlWithParams += `?${params.toString()}`;
    // }
    curlParts.push(url);

    return curlParts.join(" ");
};

export const configHttp = ({ data, header, queryParams, url }: ConfigHttpType) => {
    const parseHeader: Record<string, string> = {};
    header.forEach(({ key, value, enabled }) => {
        if (enabled) parseHeader[key] = value;
    });

    if (queryParams.length > 0) {
        const urlSearchParams = new URLSearchParams();
        queryParams.forEach(({ key, value, enabled }) => {
            if (enabled && key && value) urlSearchParams.append(key, value);
        });

        url = `${url}?${urlSearchParams.toString()}`;
    }

    let contentData = data?.content ?? "";
    if (contentData && typeof contentData !== "string") {
        const parseData: Record<string, string> = {};
        contentData.forEach(({ key, value, enabled }) => {
            if (enabled) parseData[key] = value;
        });
        contentData = JSON.stringify(parseData);
    }

    return {
        url,
        header: parseHeader,
        data: contentData,
    };
};
