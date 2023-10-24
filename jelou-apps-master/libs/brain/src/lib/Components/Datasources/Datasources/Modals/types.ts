export type Datastore = {
    id: string;
    name: string;
    description: string;
    settings: object | null;
    status: string;
    app_id: string;
    deleted_at: string;
    created_at: string;
    updated_at: string;
    knowledge_count: number;
    types: string[];
}

export type Datasource = {
    id: string;
    name: string;
    description: string;
    type: string;
    available_on_bots: boolean;
    available_on_connect: boolean;
    metadata: {
        files: string[];
    },
    sync_status: string;
    status: string;
    brain_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    chunks: number;
    tokens: number;
}

export type User = {
    id: number;
    names: string;
    lang: string;
    email: string;
    companyId: number;
}

export type stateUser = {
    userSession: User;
    datastore: Datastore;
    datasource: Datasource
}

export type Step = {
    id: number;
    number: number;
    title: {
        es: string;
        en: string;
        pt: string;
    },
    isActive: boolean;
    hasLine: boolean;
    isComplete: boolean;
}

export enum STEPS {
    PRINCIPAL_DATA = "PRINCIPAL_DATA",
    SELECT_TYPE = "SELECT_TYPE",
    FILL_DATA = "FILL_DATA",
}

export type StepList = {
    id: STEPS;
    title: {
        en: string;
        es: string;
        pt: string;
    };
    number: number;
    isActive: boolean;
    hasLine: boolean;
    isComplete: boolean;
};

export type NextStep = {
    currentStep: STEPS;
    nextStep: STEPS;
    data: Partial<Datasource>;
}