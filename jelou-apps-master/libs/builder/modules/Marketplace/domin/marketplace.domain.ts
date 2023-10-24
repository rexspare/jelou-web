import { Author, Snapshot } from "@builder/modules/ToolsVersions/domain/versions.domain";

export type MarcketplaceTools = {
    _id: string;
    version: string;
    workflowId: string;
    type: string;
    appId: string;
    snapshot: Snapshot;
    author: Author;
};

export type IMarcketplaceToolsRepository = {
    getTools(): Promise<MarcketplaceTools[]>;
    importTool(version: string, toolkitId: string): Promise<MarcketplaceTools>;
};
