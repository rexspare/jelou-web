import { BaseConfiguration } from "../../domain/nodes";

export type SkillNode = {
    configuration: BaseConfiguration & {
        skillId: string;
    };
};
