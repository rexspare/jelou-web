import { useState } from "react";
import { EdgeProps, getSmoothStepPath } from "reactflow";

import { DeleteBlockIcon } from "@builder/Icons";
import { useDisconnectEdge } from "@builder/hook/customConnection.hook";
import { ArrowEndMarkers } from "./ArrowEnd";

const foreignObjectSize = 40;

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, animated }: EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const { handleEdgeClick } = useDisconnectEdge();
    const [onhover, setOnhover] = useState(false);
    let arrowMarkerId = onhover ? "hoverArrowEnd" : "defaultArrowEnd";

    let stroke = onhover ? "#00B3C7" : "#DCDEE4";

    if (animated) {
        stroke = "#00B3C7";
        arrowMarkerId = "hoverArrowEnd";
    }

    return (
        <>
            <path
                id={id}
                style={{
                    stroke,
                    strokeWidth: 3,
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={`url(#${arrowMarkerId})`}
                onMouseOver={(evt) => {
                    setOnhover(true);
                }}
                onMouseLeave={() => setOnhover(false)}
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
            <ArrowEndMarkers color="#00B3C7" id="hoverArrowEnd" />
            <ArrowEndMarkers color="#DCDEE4" id="defaultArrowEnd" />
        </>
    );
}
