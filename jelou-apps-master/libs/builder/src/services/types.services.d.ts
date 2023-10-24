export type Media = {
    id?: number;
    filename: string;
    url: string;
    modelType: string;
    collectionName: string;
    modelId: string;
};

export type Company = {
    id: string;
    name: string;
    companyId: number | null;
    configuration: unknown;
    state: boolean;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    token: string;
    properties: {
        [key: string]: unknown;
    };
};

export type CompanySettings = {
    entity: {
        type: string;
        id: number;
    };
    settings: {
        key: string;
        value: {
            [key: string]: unknown;
        };
        typeOf: string;
    }[];
};

export type Team = {
    id: number;
    name: string;
    properties: {
        views: string[];
        operatorView: {
            workingDays: string[];
            isEnableWorkingDays: boolean;
            workingDaysDetailed: {
                [key: string]: {
                    initialHour: string;
                    finalHour: string;
                };
            };
        };
    };
    companyId: number;
    state: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
};

export type Operator = {
    id: number;
    names: string;
    email: string;
    companyId: number;
    providerId: string;
    loggedInAt: string;
    properties: null;
    loggedOutAt: string;
    active: number;
    status: string;
    User: {
        id: number;
        names: string;
        lang: string;
        email: string;
        emailVerified: null;
        companyId: number;
        active: string;
        state: boolean;
        providerId: string;
        recoverToken: null;
        recoverTokenExpires: null;
        googleToken: null;
        facebookToken: null;
        externalToken: null;
        operatorActive: string;
        createdBy: number;
        properties: null;
        shouldReceiveEmail: null;
        isMigrated: boolean;
        isOperator: boolean;
        operatorId: number;
        monitorAllTeams: boolean;
        loggedInAt: string;
        loggedOutAt: string;
        deletedAt: null;
        createdAt: string;
        updatedAt: string;
    };
    deletedAt: null;
    team: string;
};
