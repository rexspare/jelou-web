import { EdgeProps, getSmoothStepPath } from "reactflow";

import { DeleteBlockIcon } from "@builder/Icons";
import { useDisconnectEdge } from "@builder/hook/customConnection.hook";
import { ArrowEndMarkers } from "./ArrowEnd";

const foreignObjectSize = 40;

export default function SuccessEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, markerEnd }: EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const { handleEdgeClick } = useDisconnectEdge();

    return (
        <>
            <path
                id={id}
                style={{
                    stroke: "#59AD00",
                    strokeWidth: 3,
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd="url(#successArrowEnd)"
            />
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={labelX - foreignObjectSize / 2}
                y={labelY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <div className="wrapperButton hidden h-full w-full items-center justify-center">
                    <button className="grid h-6 w-10 place-content-center rounded-md bg-white text-gray-400 hover:text-primary-200" onClick={() => handleEdgeClick(id)}>
                        <DeleteBlockIcon width={16} height={16} />
                    </button>
                </div>
            </foreignObject>
            <ArrowEndMarkers color="#59AD00" id="successArrowEnd" />
        </>
    );
}
