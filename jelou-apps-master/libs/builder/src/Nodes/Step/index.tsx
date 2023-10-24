import get from "lodash/get";
import { Handle, Node, NodeProps, Position, useReactFlow } from "reactflow";

import { EmptyNodeIcon, StepIcon } from "@builder/Icons";
import { useConfigNodeId } from "@builder/Stores";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { PREFIX_TARGET_IF_ERROR_NODE } from "@builder/constants.local";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { IStepNode } from "@builder/modules/Nodes/Step/domain/step.domain";
import { useStepNode } from "@builder/modules/Nodes/Step/infrastructure/StepNode.hook";

export const StepNode = (props: NodeProps<IStepNode>) => {
    const showDropStepNode = get(props, "data.configuration.title") !== "" || get(props, "data.configuration.comments") !== "";

    return (
        <Switch>
            <Switch.Case condition={showDropStepNode}>
                <DropStepNode {...props} />
            </Switch.Case>
            <Switch.Default>
                <EmptyStepNode {...props} />
            </Switch.Default>
        </Switch>
    );
};

type DropStepNodeProps = NodeProps<IStepNode> & {
    handleTargetId?: string;
};

const DropStepNode = ({ id: nodeId, data, handleTargetId }: DropStepNodeProps) => {
    const { title = "", comments = "" } = data?.configuration ?? {};

    const { nodeRef, targetHandleStyle, targetHandleHover, selectConfigNode, handleOnDragExitNode, handleOnDragOverNode, handleOnDropNode, setTargetHandleHover } = useStepNode({ nodeId });
    const onConnect = useOnConnect();

    return (
        <div
            ref={nodeRef}
            className="relative transition-all duration-200 ease-linear [&.dropzone]:scale-110 [&.dropzone>article]:border-[#00B3C7]"
            onClick={selectConfigNode}
            onDrop={handleOnDropNode}
            onDragOver={handleOnDragOverNode}
            onDragLeave={handleOnDragExitNode}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={targetHandleHover ? { ...targetHandleStyle, borderWidth: 1, borderStyle: "dashed" } : targetHandleStyle}
                id={handleTargetId ?? nodeId}
                className="absolute top-0 left-0 h-40 w-40"
                onMouseEnter={() => setTargetHandleHover(true)}
                onMouseLeave={() => setTargetHandleHover(false)}
            />
            <article className="shadow-nodo Switch.gap-x-4 w-64 min-w-8 max-w-64 items-center justify-center rounded-12 border-2 border-dashed bg-[#FAFBFC] text-[#00B3C7]">
                <header className="flex h-11 justify-between rounded-t-10 bg-[#F2FBFC] px-4 font-medium">
                    <div className="flex items-center gap-2">
                        {<StepIcon width={20} />}
                        <h3 aria-label="title-node" className="w-[10rem] truncate">
                            Nuevo paso
                        </h3>
                    </div>
                </header>
                <main aria-label={`wrapNode-${nodeId}`} className="grid px-4 py-3">
                    <section className="mb-3 flex flex-col items-center justify-center gap-y-2 border-b-1 border-[#DCDEE4] pb-3">
                        <EmptyNodeIcon />
                        <p className="w-32 text-center text-gray-400">Arroja un nodo o herramienta</p>
                    </section>

                    <section className="flex flex-col pb-1">
                        <p className="mb-1 block text-[10px] font-extrabold uppercase text-[#B0B6C2]">Detalle</p>
                        <p className="text-sm font-bold text-gray-610">{title}</p>
                        <p className="text-xs text-gray-610/50">{comments}</p>
                    </section>
                </main>
            </article>
            <Handle
                id={nodeId}
                type="source"
                position={Position.Right}
                className="targetsHandles !-right-[0.5rem]"
                onConnect={onConnect({})}
                // isValidConnection={(connection) => {
                //     const targetConnection = connection.targetHandle ?? connection.target ?? "";
                //     if (connection.target === connection.source) return false;
                //     return !targetConnection.startsWith(PREFIX_TARGET_IF_ERROR_NODE);
                // }}
            />
        </div>
    );
};

type EmptyStepNodeProps = NodeProps & {
    handleTargetId?: string;
};

const EmptyStepNode = ({ id, handleTargetId }: EmptyStepNodeProps) => {
    const { getNode } = useReactFlow();
    const { nodeRef, targetHandleStyle, handleOnDropNode, handleOnDragExitNode, handleOnDragOverNode, setTargetHandleHover } = useStepNode({ nodeId: id });
    const onConnect = useOnConnect();

    const currentNode = getNode(id) as Node;
    const setNodeIdSelected = useConfigNodeId((state) => state.setNodeIdSelected);

    const selectConfigNode = () => {
        if (currentNode) setNodeIdSelected(id);
    };

    return (
        <div
            ref={nodeRef}
            className="relative transition-all duration-200 ease-linear [&.dropzone]:scale-110 [&.dropzone>article]:border-[#00B3C7]"
            onClick={selectConfigNode}
            onDrop={handleOnDropNode}
            onDragOver={handleOnDragOverNode}
            onDragLeave={handleOnDragExitNode}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={targetHandleStyle}
                id={handleTargetId ?? id}
                className="absolute top-0 left-0 h-40 w-40"
                onMouseEnter={() => setTargetHandleHover(true)}
                onMouseLeave={() => setTargetHandleHover(false)}
            />
            <article className="shadow-nodo flex h-15 w-64 min-w-8 max-w-64 items-center justify-center gap-x-4 rounded-12 border-2 border-dashed bg-white">
                <StepIcon width={24} height={24} fill="#00B3C7" />
                <p className="text-base text-gray-400">Nuevo paso</p>
            </article>
            <Handle
                id={id}
                type="source"
                position={Position.Right}
                className="targetsHandles !-right-[0.5rem]"
                onConnect={onConnect({})}
                // isValidConnection={(connection) => {
                //     const targetConnection = connection.targetHandle ?? connection.target ?? "";
                //     return !targetConnection.startsWith(PREFIX_TARGET_IF_ERROR_NODE);
                // }}
            />
        </div>
    );
};
