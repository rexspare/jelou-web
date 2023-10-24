import { BaseConfiguration } from "../../domain/nodes";

export enum ACTIONS_DATUM {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    SEARCH = "search",
}

export type DatumQuery = {
    id: string;
    field: string;
    operator: string;
    value: string;
};

export enum QueryInputName {
    Field = "field",
    Value = "value",
    Operator = "operator",
}

export type IDatum = {
    configuration: BaseConfiguration & {
        action?: ACTIONS_DATUM;
        databaseId?: number;
        variable?: string;
        row: {
            id?: number;
            data: Record<string, string>;
        };
        query: DatumQuery[];
    };
};

export type IDatumRepository = {
    getAll: () => Promise<Database[]>;
    getDatabasesByFav: (isFavorite: boolean) => Promise<Database[]>;
    getOne: (databaseId: number) => Promise<Database>;
};

/**
 * Databases - datum
 */

export type Database = {
    id: number;
    name: string;
    slug: string;
    slugInDriver: string;
    schemaType: string;
    driver: string;
    description: string;
    companyId: number;
    schema: Schema;
    schemaBackup: null;
    properties: null;
    state: boolean;
    lastAddedRow: null;
    isFavorite: boolean;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
    metadata: Metadata;
};

export type OneDatabase = Database & {
    columns: Column[];
};

export type Column = {
    id: number;
    databaseId: number;
    name: string;
    description?: string;
    key: string;
    type: string;
    isSortable: boolean;
    isRequired: boolean;
    isEditable: boolean;
    order: number;
    state: number;
    updatedAt: string;
    createdAt: string;
    isVisible: boolean;
    isMetadata: boolean;
    filters: [];
};

export type Metadata = {
    id: number;
    databaseId: number;
    databaseMetadataSyncId: number;
    size: number;
    rowsCount: number;
    rowsIncrementPercentage: number;
    rowLastUpdatedAt: string | null;
    rowLastCreatedAt: string | null;
    updatedAt: string;
    createdAt: string;
};

export type Schema = {
    type: string;
    required: unknown[];
    properties: Properties;
    additionalProperties: boolean;
};

type PropertiesTypes = { type: string; forma?: string; database: string };

export type Properties = Record<string, PropertiesTypes>;
