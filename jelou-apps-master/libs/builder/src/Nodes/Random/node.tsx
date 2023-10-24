import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

import { RandomIcon } from "@builder/Icons";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { type IRandomNode } from "@builder/modules/Nodes/Random/domain/random.domain";
import { RandomConfig } from "@builder/modules/Nodes/Random/infrastructure/RandomConfig";
import { WrapperNode } from "../Wrapper";

const styleNode = { bgHeader: "#fff", textColorHeader: "#00B3C7" };

export const RandomNode = ({ id: nodeId, data, selected }: NodeProps<IRandomNode>) => {
    const { title, routes } = data.configuration;
    const { setEdges } = useReactFlow();

    const onConnect = useOnConnect();

    return (
        <WrapperNode title={title} nodeId={nodeId} styleNode={styleNode} isActiveButtonsBlock={false} showDefaultHandle={false} selected={selected} Icon={() => <RandomIcon />}>
            {routes.map((route) => {
                const nodeStyle = { backgroundColor: "" };

                return (
                    <div key={route.id} className="flex justify-between rounded-md bg-white">
                        <div className="flex h-fit w-full min-w-[2rem] justify-between p-2 text-gray-400">
                            <p className="max-w-[112px] truncate text-base text-[#727C94]">{route.name}</p>
                            <p className="text-base font-bold text-[#374361]">{RandomConfig.getWeightFromPercentage(route.weight)}%</p>
                        </div>
                        <div style={nodeStyle} className="relative w-[32px] rounded-r-md bg-[#BFECF1]">
                            <Handle id={route.id} style={{ position: "relative", margin: "0" }} type="source" position={Position.Right} className={"targetsHandles"} onConnect={onConnect(setEdges)} />
                        </div>
                    </div>
                );
            })}
        </WrapperNode>
    );
};
