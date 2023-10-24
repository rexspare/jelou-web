import { BaseConfiguration } from "../../domain/nodes";

export interface IMemoryNode {
    configuration: BaseConfiguration & {
        variable: string;
        value: string;
    };
}
