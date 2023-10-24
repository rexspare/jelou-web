import type { End } from "@builder/modules/Nodes/domain/nodes";
import type { Output } from "@builder/modules/OutputTools/domain/outputs.domain";
import type { NodeProps } from "reactflow";

import { isEmpty } from "lodash";

import { EndIcon } from "@builder/Icons";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { OUTPUT_TYPES } from "@builder/modules/OutputTools/domain/contants.output";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";
import { WrapperNode } from "../Wrapper";
import { DEFAULT_END_COLORS, bodyColors, endColors } from "./constants.end";

export const EndNode = ({ id: nodeId, selected, data }: NodeProps<End>) => {
    const { outputId } = data.configuration;
    const { tool } = useQueryTool();
    const { Outputs = [] } = tool || {};
    const output = Outputs.find((output) => output.id === outputId) as Output;
    const { displayName } = output || {};

    const isSuccess = output?.type === OUTPUT_TYPES.SUCCESS;
    const title = isSuccess ? "Success" : "Error";
    const bodyColor = bodyColors[output?.type];
    const styleWrapperNode = endColors[output?.type] ?? DEFAULT_END_COLORS;
    const showVariable = output?.name;

    return (
        <WrapperNode title={title} nodeId={nodeId} selected={selected} showDefaultHandle={false} Icon={() => <EndIcon />} isActiveButtonsBlock={false} styleNode={styleWrapperNode}>
            <Switch>
                <Switch.Case condition={isEmpty(output)}>
                    <main className="shadow-nodo w-40 bg-white py-2 text-15 font-normal">Haz click para configurar</main>
                </Switch.Case>
                <Switch.Case condition={!isEmpty(output)}>
                    <main className={`shadow-nodo w-60 overflow-hidden`}>
                        <div className={`space-y-2 px-3 py-2 ${bodyColor}`}>
                            <p className="break-words text-sm font-light capitalize leading-4 line-clamp-2">
                                <b>Nombre:</b> {displayName}
                            </p>
                            <p className="break-words text-sm font-light leading-4 line-clamp-2">
                                <b>Variable:</b> {showVariable}
                            </p>
                        </div>
                    </main>
                </Switch.Case>
            </Switch>
        </WrapperNode>
    );
};
