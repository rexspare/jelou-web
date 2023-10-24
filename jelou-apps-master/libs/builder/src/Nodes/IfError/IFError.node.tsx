import type { IfErrorNode as IfErrorNodeType } from "@builder/modules/Nodes/domain/nodes";
import type { NodeProps } from "reactflow";

import { Handle, Position } from "reactflow";

import { ERRORS_PMA } from "../PMA/constants.pma";
import { WrapperNode } from "../Wrapper";

import { ErrorIcon } from "@builder/Icons";
import { PREFIX_SOURCE_IF_ERROR_NODE } from "@builder/constants.local";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";

const styleNode = {
    bg: "#FCF4F5",
    bgHeader: "#FBD4CF",
    textColorHeader: "#B93121",
    border: "#F9CBC5",
};

export const IfErrorNode = ({ id, selected, data }: NodeProps<IfErrorNodeType>) => {
    const { terms = [], title } = data.configuration;

    const onConnect = useOnConnect();
    const errorValue = ERRORS_PMA.find((error) => error.value === terms[0]?.value2) || null;

    return (
        <WrapperNode
            showDefaultHandle={false}
            isActiveButtonsBlock={false}
            nodeId={id}
            selected={selected}
            title={title}
            styleNode={styleNode}
            Icon={() => <ErrorIcon width={20} height={20} color="#B93121" />}
        >
            <p className="text-red-750">{errorValue ? errorValue.value : "Por favor seleccione un error"}</p>
            <Handle
                id={`${PREFIX_SOURCE_IF_ERROR_NODE}${id}`}
                style={{ stroke: "#EC5F4F" }}
                type="source"
                position={Position.Right}
                className="targetsHandlesError !-right-[0.5rem]"
                onConnect={onConnect({ type: EDGES_TYPES.ERROR })}
            />
        </WrapperNode>
    );
};
