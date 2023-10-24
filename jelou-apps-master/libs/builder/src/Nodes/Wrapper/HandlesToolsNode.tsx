import { Handle, Position } from "reactflow";

import { PREFIX_SOURCE_IF_ERROR_NODE, PREFIX_SOURCE_SUCCESS } from "@builder/constants.local";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";

export function HandlesToolsNodes({ nodeId, isNodeCollapsed }: { nodeId: string; isNodeCollapsed: boolean }) {
    const onConnect = useOnConnect();

    return (
        <>
            <Handle
                className={`targetsHandlesSucces !-right-[0.5rem] ${isNodeCollapsed ? "!top-[1.25rem]" : "!top-[5rem]"}`}
                id={`${PREFIX_SOURCE_SUCCESS}${nodeId}`}
                position={Position.Right}
                style={{ stroke: "#59AD00" }}
                type="source"
                onConnect={onConnect({ type: EDGES_TYPES.SUCCESS })}
            />

            <Handle
                className={`targetsHandlesError !-right-[0.5rem] ${isNodeCollapsed ? "!top-[2.75rem]" : "!top-[8rem]"}`}
                id={`${PREFIX_SOURCE_IF_ERROR_NODE}${nodeId}`}
                position={Position.Right}
                style={{ stroke: "#EC5F4F" }}
                type="source"
                onConnect={onConnect({ type: EDGES_TYPES.ERROR })}
            />
        </>
    );
}
