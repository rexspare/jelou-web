import get from "lodash/get";
import { Handle, Position, useReactFlow, type Node } from "reactflow";

import type { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";

import { OptionsListIcon } from "@builder/Icons";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { BUTTONS_OPTIONS_TYPES } from "@builder/modules/Nodes/message/domain/quickReplay";
import { useConnectionWithPayload } from "@builder/modules/Nodes/message/infrastructure/connect.listText.hook";

const styleHandle = { width: "1.125rem", height: "1.125rem", top: "0.875rem", right: "0.4375rem" };

type TextListProps = {
    messageId: string;
    nodeId: string;
    title: string;
    buttonName: string;
};

export const TextList = ({ nodeId, messageId, title, buttonName }: TextListProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const messages = get(currentNode, "data.configuration.messages") || [];
    const { options = [], text } = messages.find((message) => message.id === messageId) || {};

    const { onConnetEdgeWithPayload } = useConnectionWithPayload();

    return (
        <div className="grid gap-2">
            <Switch>
                <Switch.Case condition={Boolean(text)}>
                    <div className="shadow-nodo relative min-h-[7rem] w-56 overflow-hidden break-words rounded-10 bg-white p-2">
                        <p className="mb-2 text-13 font-bold leading-4 text-gray-400">{title}</p>
                        <p className="text-13 leading-[1.5] text-gray-400 [white-space:_break-spaces]">{text}</p>
                        <div className="absolute bottom-0 -mx-[0.5rem] flex w-full items-center justify-center space-x-2 overflow-hidden bg-primary-400 py-[0.35rem] text-center">
                            <OptionsListIcon color={"#00B3C7"} />
                            <p className="text-13 leading-4 text-primary-200">{buttonName || "Menú"}</p>
                        </div>
                    </div>
                </Switch.Case>
                <Switch.Default>
                    <div className="shadow-nodo min-h-20 rounded-10 border-1 border-gray-330 bg-white pl-2">
                        <span className="text-13 font-light text-gray-340">Agrega contenido al mensaje</span>
                    </div>
                </Switch.Default>
            </Switch>

            <aside className="grid gap-1">
                {options &&
                    options.length > 0 &&
                    options.map((button) => {
                        const { id: optionId, title, type } = button;
                        const isPostbackButton = type === BUTTONS_OPTIONS_TYPES.POSTBACK;

                        return (
                            <div key={optionId} className="overflow-hidden rounded-md bg-white">
                                <label className="grid grid-cols-[1fr_auto]">
                                    <input
                                        className="h-7 max-w-[10rem] p-2 text-13 text-gray-400 placeholder:text-xs placeholder:text-[#B8BCC8] focus-within:outline-none"
                                        defaultValue={title}
                                        placeholder="Escribe tu opción"
                                        readOnly
                                    />
                                    {isPostbackButton && (
                                        <div className="relative grid h-7 min-w-[2rem] place-content-center bg-primary-75">
                                            <Handle
                                                id={optionId}
                                                style={styleHandle}
                                                type="source"
                                                position={Position.Right}
                                                className="targetsHandles"
                                                onConnect={onConnetEdgeWithPayload(nodeId, messageId, optionId)}
                                            />
                                        </div>
                                    )}
                                </label>
                            </div>
                        );
                    })}
            </aside>
        </div>
    );
};
