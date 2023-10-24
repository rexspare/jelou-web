import { useState } from "react";
import { useReactFlow } from "reactflow";

import { SpinnerIcon } from "@builder/Icons";
import { currentChannelStore } from "@builder/Stores/currentchannel";
import { ListBoxElement, ListBoxHeadless } from "@builder/common/Headless/Listbox";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { CreatorChannel } from "@builder/modules/Channels/application/createChannel";
import { CHANNELS_OPTIONS_LIST } from "@builder/modules/Channels/domain/channels.constants";
import { ChannelTypes } from "@builder/modules/Channels/domain/channels.domain";
import { ChannelRepository } from "@builder/modules/Channels/infrastructure/channels.repository";
import { ServerEdgeAdapter } from "@builder/modules/Edges/infrastructure/serverEdge.adapter";
import { ServerNodeAdapter } from "@builder/modules/Nodes/Infrastructure/ServerNode.Adapter";
import { useQueryOneSkill } from "@builder/modules/skills/infrastructure/querySkills.hook";
import { useQueryWorkflow } from "@builder/modules/workflow/infrastructure/queryWorkflow";

const channelCreator = new CreatorChannel(new ChannelRepository());
const serverNodeAdapter = new ServerNodeAdapter();
const serverEdgeAdapter = new ServerEdgeAdapter();

export const ChannelsSelector = () => {
    const { data: oneSkillData, invalidateSkills } = useQueryOneSkill();
    const { currentTypeChannel, setCurrentTypeChannel } = currentChannelStore((state) => ({ currentTypeChannel: state.currentTypeChannel, setCurrentTypeChannel: state.setCurrentTypeChannel }));

    const { Channels = [] } = oneSkillData ?? {};

    const [workflowId, setWorkflowId] = useState(() => {
        const currentChannel = Channels.find((channel) => channel.type === currentTypeChannel);
        return currentChannel?.workflowId;
    });

    const [selectedChannel, setSelectedChannel] = useState<ListBoxElement>(() => {
        const channel = CHANNELS_OPTIONS_LIST.find((channel) => channel.value === currentTypeChannel);
        return channel ?? CHANNELS_OPTIONS_LIST[0];
    });

    const { setNodes, setEdges } = useReactFlow();
    const { isFetching } = useQueryWorkflow({
        workflowId,
        successCallback: (data) => {
            const parsedNodes = serverNodeAdapter.parserList(data.Nodes);
            const parsedEdges = serverEdgeAdapter.parserList(data.Edges);
            setNodes(parsedNodes);
            setEdges(parsedEdges);
        },
    });

    const channelList: ListBoxElement[] = CHANNELS_OPTIONS_LIST.map((channel) => {
        const isActiveElement = Channels.find((channelItem) => channelItem.type === channel.value);

        return {
            ...channel,
            disabled: !isActiveElement,
            clickableOnDisabled: true,
        };
    });

    const handleSelectChannel = async (optionSelected: ListBoxElement) => {
        if (!oneSkillData) {
            return renderMessage("Tuvimos un problema al seleccionar el canal, por favor intenta de nuevo", TYPE_ERRORS.ERROR);
        }

        setSelectedChannel(optionSelected);
        const channel = await channelCreator.findOrCreate(oneSkillData, optionSelected.value as ChannelTypes);

        setWorkflowId(channel.workflowId);
        setCurrentTypeChannel(channel.type);
        invalidateSkills();
    };

    return (
        <div className="flex items-center text-gray-400 ">
            <div className="[&_div]:!w-min-[150px] [&_div]:!w-max-[150px] flex !w-[150px] items-center text-gray-400 [&_button]:h-8 [&_button]:rounded-none [&_button]:!border-y-0 [&_button]:!border-r-0 [&_#ChevronDownIcon]:ml-1 [&_#ChevronDownIcon]:h-[20px] [&_#ChevronDownIcon]:w-[20px]">
                <ListBoxHeadless list={channelList} label="" value={selectedChannel} setValue={handleSelectChannel} placeholder="Select a channel" showDescription={false} slideover />
            </div>
            {isFetching && (
                <div className="text-primary-200">
                    <SpinnerIcon />
                </div>
            )}
        </div>
    );
};
