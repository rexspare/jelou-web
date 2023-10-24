import get from "lodash/get";
import { Node, useReactFlow } from "reactflow";

import { ListBoxHeadless } from "@builder/common/Headless/Listbox";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { TextInput } from "@builder/common/inputs/Text.Input";
import { INPUTS_NAMES_TOOL_CONFIG_PANEL, IToolNode } from "@builder/modules/Nodes/Tool/domain/tool.domain";
import { useToolNodeConfigPanel } from "@builder/modules/Nodes/Tool/infrastructure/ToolNodeConfiPanel.hook";
import { useQueryVersion } from "@builder/modules/ToolsVersions/infrastructure/queryVersion";

type ToolNodeConfigPanelProps = {
    nodeId: string;
};

export const ToolNodeConfigPanel = ({ nodeId }: ToolNodeConfigPanelProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<IToolNode>;

    const { input: defaultValueInput = {}, variable: defaultVariable, version: defaultVersion, toolData } = get(currentNode, "data.configuration") ?? {};

    const { toolId, toolkitId } = toolData || {};
    const { versions = [], isLoading } = useQueryVersion({
        toolId,
        toolkitId,
    });

    const { Inputs, formRef, onChangeForm, selectedVersion, onChangeSelectVersion, versionsOptions } = useToolNodeConfigPanel({ nodeId, defaultVersion, versions });

    return (
        <form ref={formRef} onChange={onChangeForm} className="grid gap-4 px-6 py-8 text-gray-400">
            <ListBoxHeadless
                value={selectedVersion}
                setValue={onChangeSelectVersion}
                placeholder="Seleccione una versión del tool"
                slideover
                label="Version"
                list={versionsOptions}
                isLoading={isLoading}
            />
            <TextInput defaultValue={defaultVariable} label="Guardar resultado como" name={INPUTS_NAMES_TOOL_CONFIG_PANEL.VARIABLE} placeholder="Ejem: mi_respuesta" hasError="" />

            <p className="w-full border-b-1 border-gray-230"></p>

            <Switch>
                <Switch.Case condition={Boolean(selectedVersion)}>
                    <ul className="h-[calc(80vh-200px)] space-y-3 overflow-y-scroll pr-3">
                        {Inputs.map((input) => {
                            const { id, name, description, displayName, required } = input;
                            const defaultValue = (defaultValueInput as Record<string, string>)?.[name];
                            const label = required ? `${displayName} *` : displayName;

                            return (
                                <li key={id}>
                                    <TextInput defaultValue={defaultValue} name={name} label={label} labelClassName="text-sm font-semibold block mb-1" placeholder={description} />
                                </li>
                            );
                        })}
                    </ul>
                </Switch.Case>
                <Switch.Default>
                    <p className="text-13 font-normal text-gray-400">
                        Selecciona una <span className="font-semibold">versión</span> del tool para poder configurar los <span className="font-semibold">inputs</span> correspondientes
                    </p>
                </Switch.Default>
            </Switch>
        </form>
    );
};
