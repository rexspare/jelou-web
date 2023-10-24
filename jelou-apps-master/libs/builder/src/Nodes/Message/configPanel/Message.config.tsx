import get from "lodash/get";
import { useReactFlow, type Node } from "reactflow";

import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import type { MessageNode as MessageNodeType } from "@builder/modules/Nodes/message/domain/message.domain";

import { ButtonsPanel } from "./Buttons";
import { ContactBlockPanel } from "./Contact";
import { FileBlockPanel } from "./File";
import { LocationPanel } from "./Location/Location.config";
import { MediaBlockPanel } from "./Media";
import { QuickRepliesPanel } from "./QuickReplies";
import { TextBlockPanel } from "./Text";
import { TextListPanel } from "./TextList";

type MessageConfigPanelProps = {
    nodeId: string;
};

export const MessageConfigPanel = ({ nodeId }: MessageConfigPanelProps) => {
    const dataNode = useReactFlow().getNode(nodeId) as Node<MessageNodeType>;
    const messages = get(dataNode, "data.configuration.messages") || [];

    return (
        <div className="mt-4 h-full overflow-y-scroll pb-20">
            {messages &&
                messages.length > 0 &&
                messages.map((message) => {
                    switch (message.type) {
                        case BLOCK_TYPES.TEXT: {
                            const { text, id } = message;
                            return <TextBlockPanel key={id} nodeId={nodeId} messageId={id} text={text} />;
                        }

                        case BLOCK_TYPES.AUDIO:
                        case BLOCK_TYPES.VIDEO:
                        case BLOCK_TYPES.STICKER:
                        case BLOCK_TYPES.IMAGE: {
                            const { url, caption, id, type } = message;
                            return <MediaBlockPanel key={id} type={type} messageId={id} mediaUrl={url} caption={caption} nodeId={nodeId} />;
                        }

                        case BLOCK_TYPES.FILE: {
                            const { url, id, name } = message;
                            return <FileBlockPanel key={id} nodeId={nodeId} messageId={id} mediaUrl={url} name={name} />;
                        }

                        case BLOCK_TYPES.LIST: {
                            const { id, text, title = "", button } = message;
                            return <TextListPanel key={id} nodeId={nodeId} messageId={id} text={text} title={title} button={button} />;
                        }

                        case BLOCK_TYPES.BUTTONS: {
                            const { id } = message;
                            return <ButtonsPanel key={id} nodeId={nodeId} messageId={id} />;
                        }

                        case BLOCK_TYPES.QUICK_REPLY: {
                            const { id, text } = message;
                            return <QuickRepliesPanel key={id} nodeId={nodeId} messageId={id} text={text} />;
                        }

                        case BLOCK_TYPES.LOCATION: {
                            const { id } = message;
                            return <LocationPanel key={id} messageId={id} nodeId={nodeId} />;
                        }

                        case BLOCK_TYPES.CONTACT: {
                            const { id } = message;
                            return <ContactBlockPanel key={id} nodeId={nodeId} messageId={id} />;
                        }

                        default:
                            return null;
                    }
                })}
        </div>
    );
};
