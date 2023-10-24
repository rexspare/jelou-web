import { BaseConfiguration } from "../../domain/nodes";

export const MAX_DESCRIPTION_LENGHT = 100;
export const MIN_DESCRIPTION_LENGTH = 0;

export interface IStepNode {
    configuration: BaseConfiguration & {
        name: string;
        description: string;
    };
}
