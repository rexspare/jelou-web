import { getSmoothStepPath } from "reactflow";

export default function ConnectionLine({ fromX, fromY, fromPosition, toX, toY, toPosition }) {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <path
      id="edgePath"
      style={{
        stroke: "#00B3C7",
        strokeWidth: 3,
        strokeDasharray: "5 5",
      }}
      className="react-flow__edge-path"
      d={edgePath}
    />
  );
}
