import get from "lodash/get";
import { Handle, Node, Position, useReactFlow } from "reactflow";

import { Switch } from "@builder/common/Headless/conditionalRendering";
import { CheckboxInput } from "@builder/common/inputs";
import { ButtonBlock, MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { BUTTONS_OPTIONS_TYPES } from "@builder/modules/Nodes/message/domain/quickReplay";
import { useConnectionWithPayload } from "@builder/modules/Nodes/message/infrastructure/connect.listText.hook";
// import { useEffect, useState } from "react";

const styleHandle = { width: "1.125rem", height: "1.125rem", top: "0.875rem", right: "0.4375rem" };

type ButtonsProps = {
    nodeId: string;
    messageId: string;
};

export const Buttons = ({ nodeId, messageId }: ButtonsProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<MessageNode>;

    const messages = get(currentNode, "data.configuration.messages" || []);
    const { options = [], text, caption, title, settings } = messages[0] as ButtonBlock;
    const { oneTimeUseButtons = false, redirectPayload = "", type: typeSetting = "" } = settings ?? {};

    const { onConnetEdgeWithPayload } = useConnectionWithPayload();

    return (
        <div className="grid gap-2">
            <Switch>
                <Switch.Case condition={Boolean(text)}>
                    <div className="shadow-nodo max-h-[17rem] min-h-20 w-56 break-words rounded-10 bg-white p-2">
                        <p className="mb-2 text-13 font-bold leading-4 text-gray-400">{title}</p>
                        <p className="max-h-full overflow-hidden text-13 leading-[1.5] text-gray-400 [white-space:_break-spaces]">{text}</p>
                        <p className="mt-2 text-13 leading-4 text-gray-340">{caption}</p>
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

                        // const edge = edges.find((edge) => edge.sourceHandle === optionId);

                        return (
                            <div key={optionId} className="rounded-md bg-white">
                                <label className="grid grid-cols-[1fr_auto]">
                                    <input
                                        className="h-7 max-w-[10rem] rounded-xl p-2 text-13 text-gray-400 placeholder:text-xs placeholder:text-[#B8BCC8] focus-within:outline-none"
                                        defaultValue={title}
                                        placeholder="Escribe tu opción"
                                        readOnly
                                    />
                                    {isPostbackButton && (
                                        <div className={`relative grid h-7 min-w-[2rem] place-content-center rounded-r-[6px] bg-primary-75`}>
                                            {/* {edge && <div className="absolute top-[50%] left-2 -mt-[1.5px] h-[3px] w-10 bg-[#DCDEE3]"></div>} */}
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

            <label className="flex text-sm text-gray-400 first-of-type:space-x-2 ">
                <span className="text-sm font-semibold ">Botón de un solo uso</span>
                <CheckboxInput
                    checked={oneTimeUseButtons}
                    className={" group -translate-x-2 checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"}
                    name="oneTimeUseButtons"
                    disabled={true}
                    labelClassName="font-medium"
                />
            </label>
        </div>
    );
};
