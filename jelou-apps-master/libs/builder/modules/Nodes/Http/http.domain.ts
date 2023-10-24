import { BaseConfiguration } from "../domain/nodes";

export type Http = {
    configuration: BaseConfiguration & {
        url: string;
        output: string;
        method: string;
        authentication: {
            type: string;
            username: string;
            password: string;
            token: string;
            enabled: boolean;
        };
        parameters: HttpForm[];
        body: {
            type: string;
            content: string | HttpForm[] | null;
            enabled: boolean;
        };
        headers: HttpForm[];
        settings: {
            sslCertificate: boolean;
            timeout: number;
            retries: number;
        };
    };
};

export type HttpForm = {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
};

export type BasicAuth = {
    password: string;
    username: string;
};
