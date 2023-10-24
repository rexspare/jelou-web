import { Handle, Position } from "reactflow";

import { PREFIX_SOURCE_IF_ERROR_NODE, PREFIX_SOURCE_SUCCESS } from "@builder/constants.local";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";
import { OUTPUT_TYPES } from "@builder/modules/OutputTools/domain/contants.output";
import { Output } from "@builder/modules/OutputTools/domain/outputs.domain";

const outputColors = {
    [OUTPUT_TYPES.SUCCESS]: {
        bg: "#FBFFFE",
        textColor: "#209F8B",
        border: "#C1E1DC",
    },
    [OUTPUT_TYPES.FAILED]: {
        bg: "#FFF9F9",
        textColor: "#EC5F4F",
        border: "#FFD0CB",
    },
};

// const styleHandle = { width: "1.125rem", height: "1.125rem", top: "0.875rem", right: "-1.5625rem" };

type OutputItemProps = {
    output: Output;
    nodeId: string;
};

export function OutputItem({ output, nodeId }: OutputItemProps) {
    const onConnect = useOnConnect();

    const { id, displayName, description, type } = output;
    const { bg, textColor, border } = outputColors[type];

    const handleClassType = type === OUTPUT_TYPES.SUCCESS ? "targetsHandlesSucces" : "targetsHandlesError";
    const typeEdge = type === OUTPUT_TYPES.SUCCESS ? EDGES_TYPES.SUCCESS : EDGES_TYPES.ERROR;
    const prefixId = type === OUTPUT_TYPES.SUCCESS ? PREFIX_SOURCE_SUCCESS : PREFIX_SOURCE_IF_ERROR_NODE;

    return (
        <li
            key={id}
            className="flex items-center justify-between rounded-3 border-1.5 py-2 px-4 text-13"
            style={{
                borderColor: border,
                backgroundColor: bg,
                color: textColor,
            }}
        >
            <div className="grid items-center">
                <p className="mb-1 font-bold leading-none">{displayName}</p>
                <p className="leading-snug text-[#B0B6C2] line-clamp-3">{description}</p>
            </div>
            <div
                style={{
                    backgroundColor: bg,
                }}
                className="relative grid h-7 min-w-[2rem] place-content-center"
            >
                <Handle id={`${prefixId}${id}:${nodeId}`} type="source" position={Position.Right} className={`${handleClassType} !-right-[1.5rem]`} onConnect={onConnect({ type: typeEdge })} />
            </div>
        </li>
    );
}
