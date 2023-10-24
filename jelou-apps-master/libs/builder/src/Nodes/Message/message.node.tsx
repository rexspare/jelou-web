import type { MessageNode as MessageNodeType } from "@builder/modules/Nodes/message/domain/message.domain";
import type { NodeProps } from "reactflow";

import { MessageIcon } from "@builder/Icons";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { MESSAGE_LIST_NODES, SERVICES_LIST_NODES } from "@builder/ToolBar/constants.toolbar";

import { WrapperNode } from "../Wrapper";
import { Buttons } from "./Blocks/Buttons-block.node";
import { ContactBlock } from "./Blocks/Contact";
import { DocsBlock } from "./Blocks/Docs";
import { MediaBlock } from "./Blocks/Image";
import { Location } from "./Blocks/Location.node";
import { QuickReplies } from "./Blocks/QuickReplies-block.node";
import { TextArea } from "./Blocks/Text";
import { TextList } from "./Blocks/TextList";

export const MessageNode = ({ id: nodeId, selected, data }: NodeProps<MessageNodeType>) => {
    const { messages = [], title } = data.configuration;

    const hasButtonsBlock = messages.find((block) => block.type === BLOCK_TYPES.LIST || block.type === BLOCK_TYPES.QUICK_REPLY || block.type === BLOCK_TYPES.BUTTONS) ?? null;
    const isActiveButtonsBlock = hasButtonsBlock !== null;

    const [firstMessage] = messages ?? [];
    const { Icon: IconMessageByType = MessageIcon } = [...SERVICES_LIST_NODES, ...MESSAGE_LIST_NODES].find((item) => item.initialData === firstMessage?.type) ?? {};

    return (
        <WrapperNode title={title} nodeId={nodeId} selected={selected} Icon={IconMessageByType} isActiveButtonsBlock={isActiveButtonsBlock}>
            {messages && messages.length > 0 ? (
                messages.map((message) => {
                    switch (message.type) {
                        case BLOCK_TYPES.TEXT:
                            return <TextArea key={message.id} text={message.text} />;

                        case BLOCK_TYPES.AUDIO:
                        case BLOCK_TYPES.IMAGE:
                        case BLOCK_TYPES.STICKER:
                        case BLOCK_TYPES.VIDEO:
                            return <MediaBlock key={message.id} messageId={message.id} nodeId={nodeId} />;

                        case BLOCK_TYPES.FILE:
                            return <DocsBlock key={message.id} block={message} />;

                        case BLOCK_TYPES.LIST:
                            return <TextList key={message.id} messageId={message.id} nodeId={nodeId} title={message.title} buttonName={message.button} />;

                        case BLOCK_TYPES.QUICK_REPLY:
                            return <QuickReplies key={message.id} messageId={message.id} nodeId={nodeId} />;

                        case BLOCK_TYPES.BUTTONS:
                            return <Buttons key={message.id} messageId={message.id} nodeId={nodeId} />;

                        case BLOCK_TYPES.LOCATION:
                            return <Location key={message.id} data={message} />;

                        case BLOCK_TYPES.CONTACT:
                            return <ContactBlock key={message.id} data={message} />;

                        default:
                            return null;
                    }
                })
            ) : (
                <div className="shadow-nodo grid h-10 place-content-center rounded-10 border-1 border-gray-330 bg-white">
                    <span className="text-13 font-light text-gray-340">Configura tus mensajes</span>
                </div>
            )}
        </WrapperNode>
    );
};
