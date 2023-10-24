import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { CheckPointNodeIcon, StartNodeIcon } from "@apps/shared/icons";
import get from "lodash/get";

function StartNode({ data }) {
    const label = get(data, "label", "Inicio");
    const total = get(data, "total", "");

    return (
        <>
            <Handle type="source" position={Position.Right} className="-right-[0.25rem] z-20 mt-1 h-2 w-2 border-1 border-white bg-primary-200" />
            <div className="relative mb-2 flex w-[11rem] items-center rounded-lg bg-white p-2 shadow-lg">
                <StartNodeIcon className="mr-2 h-[10px] w-[10px]" />
                <span className="text-xs font-semibold text-gray-400">{label}</span>
                <div className="border h-fit absolute left-0 bottom-[-43px] flex w-full items-center rounded-lg border-[#DCDEE4] bg-[#f2fbfc] p-2 shadow-lg">
                    <CheckPointNodeIcon fill="#00B3C7" className="mr-2 h-4 w-4" />
                    <span className="text-xs text-primary-200">{total} vistas</span>
                </div>
            </div>
        </>
    );
}

export default StartNode;
