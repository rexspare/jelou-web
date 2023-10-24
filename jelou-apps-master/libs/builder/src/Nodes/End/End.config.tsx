import type { End } from "@builder/modules/Nodes/domain/nodes";
import type { OutputsTypes } from "@builder/modules/OutputTools/domain/outputs.domain";
import type { Node } from "reactflow";

import { get, isEmpty } from "lodash";
import { useCallback } from "react";
import { useReactFlow } from "reactflow";

import { ManagedIcon, WarningIcon1 } from "@apps/shared/icons";
import { inputsOutputsPanelsStore } from "@builder/Stores/inputsOutputsPanels";

import { ListBoxHeadless, type ListBoxElement } from "@builder/common/Headless/Listbox";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { DEFAULT_OUTPUT_OPTIONS, OUTPUTS_TYPES_LABELS, OUTPUT_TYPES } from "@builder/modules/OutputTools/domain/contants.output";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";

type Props = {
    nodeId: string;
};

export const EndConfig = ({ nodeId }: Props) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<End>;
    const outputId = get(currentNode, "data.configuration.outputId");

    const { tool } = useQueryTool();
    const { Outputs = [] } = tool || {};

    const { setCreateOutputModal } = inputsOutputsPanelsStore((state) => ({ setCreateOutputModal: state.setCreateOutputModal }));
    const { updateLocalNode } = useCustomsNodes();

    const outputsOptionsList: ListBoxElement<OutputsTypes>[] = Outputs.map((output) => ({
        id: output.id,
        name: output.name,
        displayName: output.displayName,
        description: output.description,
        value: output.type,
        type: output.type,
    }));

    const optionsOutputs = DEFAULT_OUTPUT_OPTIONS.concat(outputsOptionsList);
    const outputSelected = outputsOptionsList.find((output) => output.id === outputId);

    const outputOnChange = (optionSelected: ListBoxElement) => {
        if (typeof optionSelected.id === "number") {
            setCreateOutputModal(true);
            return;
        }
        updateData(optionSelected.id);
    };

    const updateData = useCallback(
        (outputIdSelected: string) => {
            const currentNode = getNode(nodeId);

            const newConfiguration = {
                configuration: {
                    ...get(currentNode, "data.configuration"),
                    outputId: outputIdSelected,
                },
            };

            updateLocalNode(nodeId, newConfiguration);
        },
        [getNode, nodeId, updateLocalNode]
    );

    const isSuccess = outputSelected?.value === OUTPUT_TYPES.SUCCESS;
    const stylesType = getStylesType(isSuccess);

    return (
        <main className="h-full p-6">
            <ul className="w-full text-[#374361]">
                <li className="flex flex-col">
                    <ListBoxHeadless value={outputSelected} label="Selecciona el output" list={optionsOutputs} setValue={outputOnChange} slideover={true} showDescription={false} />
                </li>
            </ul>
            {!isEmpty(outputSelected) && (
                <section className={`mt-4 flex flex-col rounded-12 p-5 ${stylesType.headerBody}`}>
                    <span className={`font text-lg font-bold leading-4 ${stylesType.nameStyle}`}>{outputSelected?.name}</span>
                    <div className={`mt-4 flex flex-col text-base ${stylesType.textStyle}`}>
                        <p className="font-semibold leading-4">
                            Variable: <span className="font-light leading-4">{outputSelected?.name}</span>
                        </p>
                    </div>
                    <div className={`mt-1 flex flex-col text-base ${stylesType.textStyle}`}>
                        <p className="font-semibold leading-6">
                            Descripción: <span className="font-light leading-4">{outputSelected?.description}</span>
                        </p>
                    </div>
                </section>
            )}
        </main>
    );
};

function getStylesType(isSuccess: boolean) {
    return {
        headerBody: isSuccess ? "bg-[#E9FCF5] text-[#18BA81]" : "bg-[#fee] text-[#F12B2C]",
        typeStyle: isSuccess ? "bg-[#d3f2e9] text-[#18BA81]" : "bg-[#fde1df] text-[#EC5F4F]",
        nameStyle: isSuccess ? "text-[#209f8b]" : "text-[#f12b2c]",
        textStyle: isSuccess ? "text-[#006757]" : "text-[#5a170f]",
        title: isSuccess ? OUTPUTS_TYPES_LABELS.SUCCESS : OUTPUTS_TYPES_LABELS.FAILED,
        icon: isSuccess ? <ManagedIcon width={16} height={17} /> : <WarningIcon1 width="1rem" height="0.8125rem" className="flex h-5 w-6 flex-col items-center text-[#EC5F4F]" />,
    };
}
