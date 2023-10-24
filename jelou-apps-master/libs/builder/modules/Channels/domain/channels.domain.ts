export enum ChannelTypes {
    OMNICHANNEL = "OMNICHANNEL",
    WHATSAPP = "WHATSAPP",
    FACEBOOK = "FACEBOOK",
    INSTAGRAM = "INSTAGRAM",
    WEB = "WEB",
}

export type Channel = {
    id: number;
    type: ChannelTypes;
    skillId: number;
    workflowId: number;
    configuration: object;
    state: boolean;
    appId: string;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: null;
};

export type ChannelCreate = {
    type: string;
};

export type IChannelRepository = {
    createChannel: (id: number, type: string) => Promise<Channel>;
};
