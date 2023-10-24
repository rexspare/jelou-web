export interface Variable {
    id: number;
    workflowId: number;
    name: string;
    value: string;
    type: VariableType;
}

export type CreateNewVariableParams = {
    name: string;
    value: string;
    type: VariableType;
};

export enum VariableType {
    Default = "DEFAULT",
    System = "SYSTEM",
    Secret = "SECRET",
}

export interface Company {
    id: number;
    name: string;
    clientId: string;
    clientSecret: string;
    socketId: string;
    properties: Properties;
}

export interface Properties {
    shopCredentials: ShopCredentials;
}

export interface ShopCredentials {
    jelou_pay: JelouPay;
    jelou_ecommerce: JelouEcommerce;
}

export interface JelouEcommerce {
    app_id: string;
}

export interface JelouPay {
    app_id: string;
    gateway_id: string;
    bearer_token: string;
}
