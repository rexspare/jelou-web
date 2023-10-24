import { CONTENT_TYPE_TYPES } from "@builder/modules/Nodes/Http/constants.http";
import { CURL_KEYS, ConfigHttpType, configHttp, objectToCurl, parseCurl } from "./parse";

describe("parse curl command", () => {
    it("parseCurl is a function", () => {
        expect(typeof parseCurl).toBe("function");
    });

    it("parseCurl returns an object", () => {
        expect(typeof parseCurl("")).toBe("object");
    });

    it("return an object with method", () => {
        const result = parseCurl("curl --request POST \\");
        expect(result).toHaveProperty("method");
        expect(result.method).toBe("POST");
    });

    it("return an object with url", () => {
        const result = parseCurl("curl --request POST \\ --url https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui");
        expect(result).toHaveProperty("url");
        expect(result.url).toBe("https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui");
    });

    it("return an object with method and url", () => {
        const result = parseCurl(`
     curl --request POST \
   --url https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui
    `);
        expect(result).toHaveProperty("method");
        expect(result).toHaveProperty("url");
        expect(result.method).toBe("POST");
        expect(result.url).toBe("https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui");
    });

    it("return an object with headers", () => {
        const result = parseCurl(`
    --header 'Authorization: Bearer 1|zdPkRojCQvDHNqGBYGn2WKRbC37LugQU2wnEky83' \
    --header 'Content-Type: application/json' \
    `);

        expect(result).toHaveProperty("header");
        expect(result.header).toHaveProperty("Authorization");
        expect(result.header["Authorization"]).toBe("Bearer 1|zdPkRojCQvDHNqGBYGn2WKRbC37LugQU2wnEky83");
    });

    it("return an object with data", () => {
        const result = parseCurl(`--data '{
      "cedula": "0929858736"
    }'`);
        expect(result).toHaveProperty("data");
        expect(result.data).toHaveProperty("cedula");
        expect(result.data["cedula"]).toBe("0929858736");
    });

    it("return an object with extra data 1", () => {
        const result = parseCurl(`
       curl --request POST \
      --url https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui?hola=1 \
      --header 'Authorization: Bearer 1|zdPkRojCQvDHNqGBYGn2WKRbC37LugQU2wnEky83' \
      --header 'Content-Type: application/json' \
      --data '{
          "cedula": "0929858736",
          "nombre": "Roberto",
          "apellido": "Garcia"
        }'
    `);

        expect(result).toStrictEqual({
            method: "POST",
            url: "https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui",
            queryParams: {
                hola: "1",
            },
            header: {
                Authorization: "Bearer 1|zdPkRojCQvDHNqGBYGn2WKRbC37LugQU2wnEky83",
                "Content-Type": "application/json",
            },
            data: {
                cedula: "0929858736",
                nombre: "Roberto",
                apellido: "Garcia",
            },
        });

        expect(result).toHaveProperty("data");
        expect(result.data).toHaveProperty("cedula");
        expect(result.data["cedula"]).toBe("0929858736");
        expect(result.data).toHaveProperty("nombre");
        expect(result.data["nombre"]).toBe("Roberto");
        expect(result.data).toHaveProperty("apellido");
        expect(result.data["apellido"]).toBe("Garcia");
    });

    it("return an object with extra data", () => {
        const result = parseCurl(`
    curl --request PATCH \
      --url https://workflows.jelou.ai/v1/workflows/4/edges/1 \
      --header 'Authorization: Basic NzMyZDU4YWYtODM3Ni00MTcwLWE2YzItYWZiZmE4N2M4MzA5OjFkZGY5YzI0LWUzNDgtNDI5NC1hNTYyLThkN2Y5MWY3MzlhNw==' \
      --header 'Content-Type: application/json' \
      --data '{
        "targetId": 2,
        "configuration": {}
      }'
    `);

        expect(result).toStrictEqual({
            method: "PATCH",
            url: "https://workflows.jelou.ai/v1/workflows/4/edges/1",
            queryParams: {},
            header: {
                Authorization: "Basic NzMyZDU4YWYtODM3Ni00MTcwLWE2YzItYWZiZmE4N2M4MzA5OjFkZGY5YzI0LWUzNDgtNDI5NC1hNTYyLThkN2Y5MWY3MzlhNw==",
                "Content-Type": "application/json",
            },
            data: {
                targetId: 2,
                configuration: {},
            },
        });
    });

    it("parse curl without method", () => {
        const result = parseCurl(`curl --url 'https://workflows.jelou.ai/v1/workflows/152/nodes/2eVZlrteain3ZOYeUtxB8' \
            -X 'PATCH' \
            -H 'authority: workflows.jelou.ai' \
            -H 'accept: application/json, text/plain, */*' \
            -H 'accept-language: en-US,en;q=0.9' \
            -H 'content-type: application/json' \
            -H 'sec-ch-ua: "Not/A)Brand";v="99", "Brave";v="115", "Chromium";v="115"' \
            -H 'sec-ch-ua-mobile: ?0' \
            -H 'sec-ch-ua-platform: "macOS"' \
            -H 'sec-fetch-dest: empty' \
            -H 'sec-fetch-mode: cors' \
            -H 'sec-fetch-site: cross-site' \
            -H 'sec-gpc: 1' \
            -H 'x-api-key: 9|dW7EBTcokrMHHqD7nXSQieLQ9MgKeAW101Y8p_qL' \
            --data-raw '{"posX":"1171","posY":"296.5"}' \
            --compressed`);

        expect(result.header).toStrictEqual({
            authority: "workflows.jelou.ai",
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": '"Not/A)Brand";v="99", "Brave";v="115", "Chromium";v="115"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "sec-gpc": "1",
            "x-api-key": "9|dW7EBTcokrMHHqD7nXSQieLQ9MgKeAW101Y8p_qL",
        });

        expect(result.data).toStrictEqual({
            posX: "1171",
            posY: "296.5",
        });

        expect(result.method).toBe("PATCH");

        expect(result.url).toBe("https://workflows.jelou.ai/v1/workflows/152/nodes/2eVZlrteain3ZOYeUtxB8");
    });

    it("parse curl without url tag", () => {
        const result = parseCurl(`curl 'https://workflows.jelou.ai/v1/workflows/152/nodes/2eVZlrteain3ZOYeUtxB8' \
  -X 'PATCH' \
  -H 'authority: workflows.jelou.ai' \
  -H 'x-api-key: 9|dW7EBTcokrMHHqD7nXSQieLQ9MgKeAW101Y8p_qL' \
  --data-raw '{"posX":"1171","posY":"296.5"}' \
  --compressed`);

        expect(result.header).toStrictEqual({
            authority: "workflows.jelou.ai",
            "x-api-key": "9|dW7EBTcokrMHHqD7nXSQieLQ9MgKeAW101Y8p_qL",
        });

        expect(result.data).toStrictEqual({
            posX: "1171",
            posY: "296.5",
        });

        expect(result.method).toBe("PATCH");

        expect(result.url).toBe("https://workflows.jelou.ai/v1/workflows/152/nodes/2eVZlrteain3ZOYeUtxB8");
    });
});

describe("Parse data from a curl", () => {
    it("it should return correctly the data from a curl", () => {
        const result = parseCurl(`curl --request POST \
      --url https://integrations.jelou.ai/api/v1/integrations/01gsbnyv52ka4d6sxy46etxe59/hive/verifications \
      --header 'Authorization: Bearer 1|zdPkRojCQvDHNqGBYGn2WKRbC37LugQU2wnEky83' \
      --header 'Content-Type: application/json' \
      --data '{
      "user_id": "usr_2IduHx8l4HnlBe5ydcGWwX9sJuq",
      "options": {
        "type": "identity",
        "document": {
          "required": true
        },
        "additional_evidence": {
          "required": true,
          "types": [
            "government_selfie"
          ]
        },
        "selfie": {
          "required": true,
          "liveness": true
        }
      },
      "redirect_url": null
    }'`);
        const data = result.data;
        expect(data).toStrictEqual({
            user_id: "usr_2IduHx8l4HnlBe5ydcGWwX9sJuq",
            options: {
                type: "identity",
                document: {
                    required: true,
                },
                additional_evidence: {
                    required: true,
                    types: ["government_selfie"],
                },
                selfie: {
                    required: true,
                    liveness: true,
                },
            },
            redirect_url: null,
        });
    });

    it("it should return data with urls", () => {
        const result = parseCurl(`curl --request POST \
    --url 'https://integrations.jelou.ai/api/v1/integrations/01gsbnyv52ka4d6sxy46etxe59/facephi/pad-card?asdasd=sdfdasdasd' \
    --header 'Authorization: Bearer 1|zdPkRojCQvDHNqGBYGn2WKRbC37LugQU2wnEky83' \
    --header 'Content-Type: application/json' \
    --data '{
    "frontSideImage":"https://facephi-dev-serverlessdeploymentbucket-u6ee5vbxoxy7.s3.amazonaws.com/serverless/facephi/images/document-frontside.jpeg",
    "backSideImage":"https://facephi-dev-serverlessdeploymentbucket-u6ee5vbxoxy7.s3.amazonaws.com/serverless/facephi/images/document-backside.jpeg",
    "tokenized": false,
    "countryCode":"PER",
    "idType": "ID_CARD"
    }'`);

        const data = result.data;
        expect(data).toStrictEqual({
            frontSideImage: "https://facephi-dev-serverlessdeploymentbucket-u6ee5vbxoxy7.s3.amazonaws.com/serverless/facephi/images/document-frontside.jpeg",
            backSideImage: "https://facephi-dev-serverlessdeploymentbucket-u6ee5vbxoxy7.s3.amazonaws.com/serverless/facephi/images/document-backside.jpeg",
            tokenized: false,
            countryCode: "PER",
            idType: "ID_CARD",
        });
    });

    it("it should return data with xml", () => {
        const result = parseCurl(`curl --request POST \
    --url 'https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL=' \
    --header 'Content-Type: text/xml' \
    --data '<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">
            <ubiNum>10</ubiNum>
          </NumberToWords>
        </soap:Body>
      </soap:Envelope>'
      `);

        const data = result.data;
        expect(data).toBe(`<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">
            <ubiNum>10</ubiNum>
          </NumberToWords>
        </soap:Body>
      </soap:Envelope>`);

        expect(result.header).toStrictEqual({
            "Content-Type": "text/xml",
        });

        expect(result.url).toBe("https://www.dataaccess.com/webservicesserver/numberconversion.wso");
        expect(result.method).toBe("POST");
        expect(result.queryParams).toStrictEqual({
            WSDL: "",
        });

        expect(result.method).toBe("POST");
    });

    it("it should return the correct body from a curl with raw data", () => {
        const result = parseCurl(`curl --location '/api/v1/integrations/01h00r4c9ep4ev9x982td59ykt/google/calendar/events' \
    --header 'Accept: application/json' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer 13|azyBFXvX85rhEBNy9pApBWpH0KpKieb6qmSaZ63w' \
    --data-raw '{
        "summary": "Test",
        "start_date": "2023-04-29 10:00:00",
        "end_date": "2023-04-29 11:00:00",
        "guests": ["ajmariduena@gmail.com"],
        "description": "TEST"
    }'`);

        const data = result.data;
        expect(data).toStrictEqual({
            summary: "Test",
            start_date: "2023-04-29 10:00:00",
            end_date: "2023-04-29 11:00:00",
            guests: ["ajmariduena@gmail.com"],
            description: "TEST",
        });

        expect(result.header).toStrictEqual({
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer 13|azyBFXvX85rhEBNy9pApBWpH0KpKieb6qmSaZ63w",
        });

        expect(result.url).toBe("/api/v1/integrations/01h00r4c9ep4ev9x982td59ykt/google/calendar/events");

        expect(result.method).toBe("POST");
    });
});

describe("Query params from curl", () => {
    it("it should return correctly the query params from a curl", () => {
        const result = parseCurl(`curl --request GET \
      --url 'https://integrations.jelou.ai/api/v1/integrations/01gsbnyv52ka4d6sxy46etxe59/hive/verifications?asdasd=sdfdasdasd' \
      `);

        const queryParams = result.queryParams;
        expect(queryParams).toStrictEqual({
            asdasd: "sdfdasdasd",
        });

        expect(result.url).toBe("https://integrations.jelou.ai/api/v1/integrations/01gsbnyv52ka4d6sxy46etxe59/hive/verifications");
    });
});

describe("objectToCurl", () => {
    // Tests that the function works correctly with a valid curlData object
    it("should return a valid cURL command when given a valid curlData object", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            data: `{"key1":"value1","key2":"value2"}`,
            queryParams: {
                param1: "value1",
                param2: "value2",
            },
            method: "POST",
            url: "https://example.com",
        };
        const expectedCurlCommand = 'curl -X POST -H \'Content-Type: application/json\' -H \'Authorization: Bearer token\' --data \'{"key1":"value1","key2":"value2"}\' https://example.com';
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });

    // Tests that the function works correctly with GET method and no data
    it("should return a valid cURL command when given a curlData object with GET method and no data", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            queryParams: {
                param1: "value1",
                param2: "value2",
            },
            method: "GET",
            url: "https://example.com",
            [CURL_KEYS.DATA]: "",
        };
        const expectedCurlCommand = "curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer token' https://example.com";
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });

    // Tests that the function works correctly with POST method and data
    it("should return a valid cURL command when given a curlData object with POST method and data", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            data: `{"key1":"value1","key2":"value2"}`,
            method: "POST",
            url: "https://example.com",
            [CURL_KEYS.PARAMS]: {},
        };
        const expectedCurlCommand = 'curl -X POST -H \'Content-Type: application/json\' -H \'Authorization: Bearer token\' --data \'{"key1":"value1","key2":"value2"}\' https://example.com';
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });

    // Tests that the function works correctly with PUT method and data
    it("should return a valid cURL command when given a curlData object with PUT method and data", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            data: `{"key1":"value1","key2":"value2"}`,
            method: "PUT",
            url: "https://example.com",
            [CURL_KEYS.PARAMS]: {},
        };
        const expectedCurlCommand = 'curl -X PUT -H \'Content-Type: application/json\' -H \'Authorization: Bearer token\' --data \'{"key1":"value1","key2":"value2"}\' https://example.com';
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });

    // Tests that the function works correctly with DELETE method and data
    it("should return a valid cURL command when given a curlData object with DELETE method and data", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            data: `{"key1":"value1","key2":"value2"}`,
            method: "DELETE",
            url: "https://example.com",
            [CURL_KEYS.PARAMS]: {},
        };
        const expectedCurlCommand = 'curl -X DELETE -H \'Content-Type: application/json\' -H \'Authorization: Bearer token\' --data \'{"key1":"value1","key2":"value2"}\' https://example.com';
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });

    // Tests that the function works correctly with HEAD method and no data
    it("should return a valid cURL command when given a curlData object with HEAD method and no data", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            method: "HEAD",
            url: "https://example.com",
            [CURL_KEYS.DATA]: "",
            [CURL_KEYS.PARAMS]: {},
        };
        const expectedCurlCommand = "curl -X HEAD -H 'Content-Type: application/json' -H 'Authorization: Bearer token' https://example.com";
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });

    // Tests that the function throws an error when given an invalid curlData object
    it("should throw an error when given an invalid curlData object", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            data: `{"key1":"value1","key2":"value2"}`,
            queryParams: {
                param1: "value1",
                param2: "value2",
            },
            method: "INVALID_METHOD",
            url: "https://example.com",
        };
        expect(() => objectToCurl(curlData)).toThrowError("Invalid curlData object");
    });

    // Tests that the function works correctly with OPTIONS method and no data
    it("should return a valid cURL command when given a curlData object with OPTIONS method and no data", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            method: "OPTIONS",
            url: "https://example.com",
            [CURL_KEYS.DATA]: "",
            [CURL_KEYS.PARAMS]: {},
        };
        const expectedCurlCommand = "curl -X OPTIONS -H 'Content-Type: application/json' -H 'Authorization: Bearer token' https://example.com";
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });

    // Tests that the function works correctly with PATCH method and data
    it("should return a valid cURL command when given a curlData object with PATCH method and data", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            data: `{"key1":"value1","key2":"value2"}`,
            method: "PATCH",
            url: "https://example.com",
            [CURL_KEYS.PARAMS]: {},
        };
        const expectedCurlCommand = 'curl -X PATCH -H \'Content-Type: application/json\' -H \'Authorization: Bearer token\' --data \'{"key1":"value1","key2":"value2"}\' https://example.com';
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });

    // Tests that the function works correctly with GET method and data
    it("should return a valid cURL command when given a curlData object with GET method and data", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            data: `{
        'key1': 'value1',
        'key2': 'value2'
      }`,
            method: "GET",
            url: "https://example.com",
            [CURL_KEYS.PARAMS]: {
                key1: "value1",
                key2: "value2",
            },
        };
        const expectedCurlCommand = "curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer token' https://example.com";
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });

    // Tests that the function works correctly with GET method and queryParams
    it("should return a valid cURL command when given a curlData object with GET method and queryParams", () => {
        const curlData = {
            header: {
                "Content-Type": "application/json",
                Authorization: "Bearer token",
            },
            queryParams: {
                param1: "value1",
                param2: "value2",
            },
            method: "GET",
            url: "https://example.com",
            [CURL_KEYS.DATA]: "",
        };
        const expectedCurlCommand = "curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer token' https://example.com";
        const actualCurlCommand = objectToCurl(curlData);
        expect(actualCurlCommand).toEqual(expectedCurlCommand);
    });
});

describe("parse http config to data curl", () => {
    it("should return the url", () => {
        const config = {
            header: [
                {
                    id: "CH90KFAA1xdBFoPt0Z6dk",
                    key: "Content-Type",
                    value: "application/json",
                    enabled: true,
                },
            ],
            data: null,
            queryParams: [],
            method: "",
            url: "https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui",
        };

        const result = configHttp(config);
        expect(result).toHaveProperty("url");
        expect(result.url).toBe("https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui");
    });

    it("should return the header", () => {
        const config = {
            header: [
                {
                    id: "CH90KFAA1xdBFoPt0Z6dk",
                    key: "Content-Type",
                    value: "application/json",
                    enabled: true,
                },
                {
                    id: "CH90KFAA1xdBFoPt0Z6dk",
                    key: "Authorization",
                    value: "Bearer 1|zdPkRojCQvDHNqGBYGn2WKRbC37LugQU2wnEky83",
                    enabled: true,
                },
            ],
            data: null,
            queryParams: [],
            method: "",
            url: "",
        };

        const result = configHttp(config);

        expect(result).toHaveProperty("header");
        expect(result.header).toHaveProperty("Content-Type");
        expect(result.header["Content-Type"]).toBe("application/json");

        expect(result.header).toHaveProperty("Authorization");
        expect(result.header["Authorization"]).toBe("Bearer 1|zdPkRojCQvDHNqGBYGn2WKRbC37LugQU2wnEky83");
    });

    it("should return the query params in the url", () => {
        const config = {
            header: [],
            data: null,
            queryParams: [
                {
                    id: "CH90KFAA1xdBFoPt0Z6dk",
                    key: "hola",
                    value: "1",
                    enabled: true,
                },
            ],
            method: "",
            url: "https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui",
        };

        const result = configHttp(config);
        expect(result).toHaveProperty("url");
        expect(result.url).toBe("https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui?hola=1");
    });

    it("should return the data in the body", () => {
        const config: ConfigHttpType = {
            header: [],
            data: {
                type: CONTENT_TYPE_TYPES.JSON,
                enabled: true,
                content: '{"cedula":"0929858736","nombre":"Roberto","apellido":"Garcia"}',
            },
            queryParams: [],
            url: "",
        };

        const result = configHttp(config);
        expect(result).toHaveProperty("data");
        expect(result.data).toBe('{"cedula":"0929858736","nombre":"Roberto","apellido":"Garcia"}');
    });

    it("should return the data in the body when data is not null and type is not JSON", () => {
        const config: ConfigHttpType = {
            header: [],
            data: {
                type: CONTENT_TYPE_TYPES.MULTIPART_FORM,
                enabled: true,
                content: [
                    {
                        id: "CH90KFAA1xdBFoPt0Z6dk",
                        key: "cedula",
                        value: "0929858736",
                        enabled: true,
                    },
                    {
                        id: "CH90KFAA1xdBFoPt0Z6dk",
                        key: "nombre",
                        value: "Roberto",
                        enabled: true,
                    },
                    {
                        id: "CH90KFAA1xdBFoPt0Z6dk",
                        key: "apellido",
                        value: "Garcia",
                        enabled: true,
                    },
                ],
            },
            queryParams: [],
            url: "",
        };

        const result = configHttp(config);
        expect(result).toHaveProperty("data");
        expect(result.data).toBe('{"cedula":"0929858736","nombre":"Roberto","apellido":"Garcia"}');
    });

    it("should return the data in the body when data is not null and type is JSON", () => {
        const config: ConfigHttpType = {
            header: [],
            data: {
                type: CONTENT_TYPE_TYPES.JSON,
                enabled: true,
                content: '{"cedula":"0929858736","nombre":"Roberto","apellido":"Garcia"}',
            },
            queryParams: [],
            url: "",
        };

        const result = configHttp(config);
        expect(result).toHaveProperty("data");
        expect(result.data).toBe('{"cedula":"0929858736","nombre":"Roberto","apellido":"Garcia"}');
    });

    it("should return the url with query params when there are multiple query params", () => {
        const config = {
            header: [],
            data: null,
            queryParams: [
                {
                    id: "CH90KFAA1xdBFoPt0Z6dk",
                    key: "hola",
                    value: "1",
                    enabled: true,
                },
                {
                    id: "CH90KFAA1xdBFoPt0Z6dk",
                    key: "adios",
                    value: "2",
                    enabled: true,
                },
            ],
            method: "",
            url: "https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui",
        };

        const result = configHttp(config);
        expect(result).toHaveProperty("url");
        expect(result.url).toBe("https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui?hola=1&adios=2");
    });

    it("should return the url without query params when there are no enabled query params", () => {
        const config = {
            header: [],
            data: null,
            queryParams: [
                {
                    id: "CH90KFAA1xdBFoPt0Z6dk",
                    key: "hola",
                    value: "1",
                    enabled: false,
                },
            ],
            method: "",
            url: "https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui",
        };

        const result = configHttp(config);
        expect(result).toHaveProperty("url");
        expect(result.url).toBe("https://integrations.jelou.ai/api/v1/integrations/01gx4ff34m0ayacwq9ytqgk59n/civil_registry/search_by_nui?");
    });

    it("should return an empty object when header is empty", () => {
        const config = {
            header: [],
            data: null,
            queryParams: [],
            method: "",
            url: "",
        };

        const result = configHttp(config);
        expect(result).toEqual({
            url: "",
            header: {},
            data: "",
        });
    });

    it("should return an empty string when data is null", () => {
        const config = {
            header: [],
            data: null,
            queryParams: [],
            method: "",
            url: "",
        };

        const result = configHttp(config);
        expect(result).toEqual({
            url: "",
            header: {},
            data: "",
        });
    });

    it("should return an empty object when queryParams is empty", () => {
        const config = {
            header: [],
            data: null,
            queryParams: [],
            method: "",
            url: "",
        };

        const result = configHttp(config);
        expect(result).toEqual({
            url: "",
            header: {},
            data: "",
        });
    });
});
