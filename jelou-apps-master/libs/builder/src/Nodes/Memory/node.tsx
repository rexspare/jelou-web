import { NodeProps } from "reactflow";

import { WrapperNode } from "../Wrapper";
import { type IMemoryNode } from "@builder/modules/Nodes/Memory/domain/memory.domain";
import { VariableIcon } from "@builder/Icons";

export const MemoryNode = ({ id: nodeId, data, selected }: NodeProps<IMemoryNode>) => {
    const { title, variable } = data.configuration;
    const content = variable === "" ? "" : `Variable: ${variable}`;

    return (
        <WrapperNode title={title} nodeId={nodeId} selected={selected} showDefaultHandle Icon={VariableIcon} isActiveButtonsBlock={false}>
            <input
                className="h-8 w-full rounded-md p-2 text-13 text-gray-400 placeholder:text-xs placeholder:text-[#B8BCC8] focus-within:outline-none"
                placeholder="Establece una variable"
                defaultValue={content}
                readOnly
            />
        </WrapperNode>
    );
};
