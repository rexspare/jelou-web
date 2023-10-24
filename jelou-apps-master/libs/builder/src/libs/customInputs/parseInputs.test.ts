import { AUTH_TYPES, CONTENT_TYPE_TYPES } from "@builder/modules/Nodes/Http/constants.http";
import { Http } from "@builder/modules/Nodes/Http/http.domain";
import { getCustomInputs } from "./parseInputs";

const initialInput: Http = {
    configuration: {
        url: "https://bike-api.deno.dev/{{$input.api}}",
        body: {
            type: CONTENT_TYPE_TYPES.JSON,
            content: '{\n  "name": "${{$input.username}}",\n}',
            enabled: true,
        },
        title: "API",
        method: "POST",
        output: "khabsdkhbasdkhba",
        headers: [
            {
                id: "CH90KFAA1xdBFoPt0Z6dk",
                key: "Content-Type",
                value: "application/json",
                enabled: true,
            },
        ],
        settings: {
            retries: 0,
            timeout: 30000,
            sslCertificate: true,
        },
        collapsed: false,
        parameters: [
            {
                id: "4OEssuaVcRbmdcmXKkIPv",
                key: "HOLA",
                value: "que tal",
                enabled: true,
            },
            {
                id: "DY5KBEGLNMouPF0DbcCwG",
                key: "qq",
                value: "va",
                enabled: true,
            },
        ],
        authentication: {
            type: AUTH_TYPES.BASIC,
            enabled: true,
            password: "que ",
            username: "hola",
            token: "",
        },
    },
};

const complexConfiguration: Http = {
    configuration: {
        url: "https://integrations.jelou.ai/api/v1/integrations/{{$input.integration_id}}/hive/verifications",
        body: {
            type: CONTENT_TYPE_TYPES.JSON,
            content:
                '{\n\t"user_id": "{{$input.user_id}}",\n\t"options": {\n\t\t"type": "selfie",\n\t\t"selfie": {\n\t\t\t"required": true,\n\t\t\t"liveness": true\n\t\t},\n\t\t"document": {\n\t\t\t"required": false\n\t\t},\n\t\t"additional_evidence": {\n\t\t\t"types": [\n\t\t\t\t"government_selfie"\n\t\t\t],\n\t\t\t"required": true\n\t\t}\n\t},\n\t"metadata": {\n\t\t"bot_id": "{{$input.bot_id}}",\n\t\t"user_id": "{{$input._userId}}",\n\t\t"flow_id": "{{$input.outcoming_flow}}"\n\t}\n}',
            enabled: true,
        },
        title: "API",
        method: "POST",
        output: "createVerification",
        headers: [
            {
                id: "4Sh4Q1Ie6ljU_67bqs1r7",
                key: "Authorization",
                value: "Bearer {{$input.bearer_token}}",
                enabled: true,
            },
        ],
        settings: {
            retries: 0,
            timeout: 30000,
            sslCertificate: true,
        },
        collapsed: false,
        parameters: [
            {
                id: "XXrKkAtZcKzxbwCI0CZaY",
                key: "",
                value: "",
                enabled: true,
            },
            {
                id: "XXrKkAtZcKzxbwCI0CZaY",
                key: "some awesome key",
                value: "{{$input.awesome_key}}",
                enabled: true,
            },
        ],
        authentication: {
            type: AUTH_TYPES.BASIC,
            enabled: true,
            password: "{{$input.password}}",
            username: "{{$input.username}}",
            token: "",
        },
    },
};

const regex = /\{\{\$input.(.*?)\}\}/g;

describe("Parse Inputs Module", () => {
    describe("when get custom inputs with configuration object", () => {
        let result: string[];

        beforeAll(() => {
            result = getCustomInputs(initialInput.configuration, regex);
        });

        it("should return the values with deep 1", () => {
            const expectedResult = ["api"];

            expect(expectedResult).toEqual(result);
        });
    });

    describe("when get custom inputs with configuration and body object", () => {
        let result: string[];

        beforeAll(() => {
            result = getCustomInputs(initialInput.configuration, regex, ["body"]);
        });

        it("should return the values with the object deep", () => {
            const expectedResult = ["username", "api"];

            expect(expectedResult).toEqual(result);
        });
    });

    describe("when get custom inputs with complex configuration", () => {
        let result: string[];

        beforeAll(() => {
            result = getCustomInputs(complexConfiguration.configuration, regex, ["body", "headers", "parameters", "authentication"]);
        });

        it("should return the values with the selected object", () => {
            const expectedComplexConfiguration = ["user_id", "bot_id", "_userId", "outcoming_flow", "bearer_token", "awesome_key", "password", "username", "integration_id"];
            expect(expectedComplexConfiguration).toEqual(result);
        });
    });
});
