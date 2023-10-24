import { Skill } from "@builder/modules/skills/domain/skills.domain";
import { ChannelTypes, IChannelRepository } from "../domain/channels.domain";

export class CreatorChannel {
    constructor(private readonly channelRepository: IChannelRepository) {}

    async findOrCreate(skill: Skill, channelType: ChannelTypes) {
        const hasChannelSelected = skill.Channels.find((channel) => channel.type === channelType);

        if (hasChannelSelected) {
            return hasChannelSelected;
        }

        return await this.channelRepository.createChannel(skill.id, channelType);
    }
}
