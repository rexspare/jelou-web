import get from "lodash/get";
import { type NodeProps } from "reactflow";

import { Switch } from "@builder/common/Headless/conditionalRendering";
import type { IToolNode } from "@builder/modules/Nodes/Tool/domain/tool.domain";
import { useQueryVersion } from "@builder/modules/ToolsVersions/infrastructure/queryVersion";
import { getThumbnailsIcon } from "@builder/shared/utils";
import { WrapperNode } from "..";
import { OutputItem } from "./output.item";

export const ToolNode = ({ data, id: nodeId, selected }: NodeProps<IToolNode>) => {
    const { title, version: versionSelected, toolData } = get(data, "configuration") ?? {};
    const { toolId, toolkitId, toolName = title, complementaryColor, principalColor, thumbnail = -1 } = toolData || {};

    const { versions = [] } = useQueryVersion({ toolId, toolkitId });
    const versionDataSelected = versions.find((version) => version.version === versionSelected);

    const Icon = getThumbnailsIcon(thumbnail);

    const styleNode = {
        bgHeader: principalColor ?? "#00A2CF",
        textColorHeader: complementaryColor ?? "#E6F6FA",
    };

    const Outputs = get(versionDataSelected, "snapshot.Outputs") ?? [];
    const outputsSuccess = Outputs.filter((output) => output.type === "SUCCESS");
    const outputsError = Outputs.filter((output) => output.type === "FAILED");
    const outputsOptions = outputsSuccess.concat(outputsError);

    return (
        <WrapperNode nodeId={nodeId} isActiveButtonsBlock selected={selected} Icon={Icon} title={toolName} styleNode={styleNode}>
            <Switch>
                <Switch.Case condition={Boolean(versionSelected && versionDataSelected)}>
                    <ul className="space-y-3">
                        {outputsOptions.map((output) => (
                            <OutputItem key={output.id} output={output} nodeId={nodeId} />
                        ))}
                    </ul>
                </Switch.Case>
                <Switch.Default>
                    <p className="text-13 font-bold text-gray-400">Haz click y configura los outputs de este tool</p>
                </Switch.Default>
            </Switch>
        </WrapperNode>
    );
};
