import { Channel } from "@builder/modules/Channels/domain/channels.domain";

export type Skill = {
    id: number;
    name: string;
    description: string;
    appId: string;
    configuration: Configuration;
    state: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    Channels: Channel[];
};



export type Configuration = object;

export type SkillCreate = {
    name: string;
    description: string;
    configuration: object;
};

export type ISkillsRepository = {
    getAll: () => Promise<Skill[]>;
    getOne: (id: number) => Promise<Skill>;
    create: (skill: SkillCreate) => Promise<Skill>;
    update: (id: number, skill: Partial<SkillCreate>) => Promise<Skill>;
    delete: (id: number) => Promise<number>;
};
