import { Handle, Position } from "reactflow";

import { PREFIX_SOURCE_IF_ERROR_NODE, PREFIX_SOURCE_SUCCESS } from "@builder/constants.local";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";

import { ACTIONS_DATUM } from "@builder/modules/Nodes/Datum/domain/datum.domain";
import { PATHS_ACTIONS_VERBS } from "@builder/modules/Nodes/Datum/domain/datum.node.constants";

type Props = {
    nodeId: string;
    action?: ACTIONS_DATUM;
};

export function PathsDatumNode({ nodeId, action }: Props) {
    const onConnect = useOnConnect();
    const verbsAction = PATHS_ACTIONS_VERBS[action as ACTIONS_DATUM];

    return (
        <>
            <h4 className="text-13 font-bold leading-4 text-gray-400">CAMINOS</h4>

            <div className="flex justify-between rounded-md bg-white">
                <div className="h-fit min-w-[2rem] p-3 ">
                    <p className="text-xs text-gray-610">{`Si se ${verbsAction} el registro`}</p>
                </div>
                <div className="relative w-8 rounded-r-md bg-[#E9FCF5]">
                    <Handle
                        id={PREFIX_SOURCE_SUCCESS + nodeId}
                        style={{ position: "relative", margin: "0" }}
                        type="source"
                        position={Position.Right}
                        className="targetsHandlesSucces"
                        onConnect={onConnect({ type: EDGES_TYPES.SUCCESS })}
                    />
                </div>
            </div>
            <div className="flex justify-between rounded-md bg-white">
                <div className="h-fit min-w-[2rem] p-3 ">
                    <p className="text-xs text-gray-610">{`No se ${verbsAction} el registro`}</p>
                </div>
                <div className="relative w-8 rounded-r-md bg-[#FDEFED]">
                    <Handle
                        id={PREFIX_SOURCE_IF_ERROR_NODE + nodeId}
                        style={{ position: "relative", margin: "0" }}
                        type="source"
                        position={Position.Right}
                        className="targetsHandlesError"
                        onConnect={onConnect({ type: EDGES_TYPES.ERROR })}
                    />
                </div>
            </div>
        </>
    );
}
