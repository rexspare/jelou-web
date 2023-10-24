import debounce from "lodash/debounce";
import { useState } from "react";
import { Node, useReactFlow } from "reactflow";

import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { ServerNode } from "@builder/modules/Nodes/domain/nodes";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";

import { TextAreaInput } from "@builder/common/inputs";
import { showCaptionMediaBlock } from "@builder/modules/Nodes/message/domain/messagesByChannels.validation";
import { getCaptionMediaMaxLenght, validateMessageText } from "@builder/modules/Nodes/message/domain/sizeMessage.validation";
import { RenderImg } from "../Blocks/Image/RenderImg";
import CircularProgress from "@builder/common/CircularProgressbar";

type RenderImgProps = {
  type: BLOCK_TYPES;
  nodeId: string;
  messageId: string;
  mediaUrl: string;
  caption: string;
};

export const MediaBlockPanel = ({ messageId, mediaUrl, caption, nodeId, type }: RenderImgProps) => {
  const { getNode } = useReactFlow();
  const { updateLocalNode } = useCustomsNodes();

    const [hasError, setHasError] = useState<string | undefined>(undefined);
    const maxLength = getCaptionMediaMaxLenght();

  const currentNode = getNode(nodeId) as Node<MessageNode>;
  const saveUrlMedia = (url: string) => async () => handleSaveData({ currentNode, key: "url", value: url, messageId, updateLocalNode });

  const handleSaveText = debounce((event: React.ChangeEvent<HTMLElement>) => {
    const { value: newText } = event.target as HTMLInputElement;

    const { message } = validateMessageText(newText);
    setHasError(message);
    if (message) return;

    handleSaveData({ currentNode, key: "caption", value: newText, messageId, updateLocalNode });
  }, 800);

  return (
    <div className="pb-4">
      <RenderImg type={type} url={mediaUrl} showBtnAddMedia saveUrlMedia={saveUrlMedia} />
      <div className="m-4">
            {showCaptionMediaBlock(type) && (
                <>
                    <TextAreaInput onChange={handleSaveText} defaultValue={caption} label="Caption" placeholder="Escribe aquí un caption" hasError={hasError} maxLength={maxLength} />
                    <CircularProgress MAXIMUM_CHARACTERS={maxLength} MINIMUM_CHARACTERS={0} countFieldLength={caption.length} />
                </>
            )}
        </div>
        </div>
    );
};

type HandleSaveTextProps = {
  updateLocalNode: (nodeId: string, data: Partial<ServerNode>) => Promise<void>;
  messageId: string;
  key: string;
  value: string;
  currentNode: Node<MessageNode>;
};
export const handleSaveData = ({ messageId, currentNode, updateLocalNode, key, value }: HandleSaveTextProps) => {
  const { messages } = currentNode.data.configuration;
  const newMessages = messages.map((message) => (message.id === messageId ? { ...message, [key]: value } : message));

  const updateNode: MessageNode = {
    configuration: {
      ...currentNode.data.configuration,
      messages: newMessages,
    },
  };

  updateLocalNode(currentNode.id, updateNode);
};
