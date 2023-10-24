import { debounce, get, isEmpty } from "lodash";
import { useCallback, useState } from "react";
import { Node, useReactFlow } from "reactflow";

import CircularProgress from "@builder/common/CircularProgressbar";
import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { IStepNode, MAX_DESCRIPTION_LENGHT, MIN_DESCRIPTION_LENGTH } from "@builder/modules/Nodes/Step/domain/step.domain";
import { BaseConfiguration } from "@builder/modules/Nodes/domain/nodes";

type StepConfigPanelProps = {
    nodeId: string;
};

export const StepConfigPanel = ({ nodeId }: StepConfigPanelProps) => {
    const { updateLocalNode } = useCustomsNodes();

    const { getNode } = useReactFlow();
    const node = getNode(nodeId) as Node<IStepNode>;

    // const [stepName, setStepName] = useState<string>(get(node, "data.configuration.title") ?? "");
    // const [stepDescription, setStepDescription] = useState<string>(get(node, "data.configuration.comments") ?? "");
    const stepName = get(node, "data.configuration.title") ?? "";
    const stepDescription = get(node, "data.configuration.comments") ?? "";

    const [stepDescriptionExceedError, setStepDescriptionExceedError] = useState<string>("");

    const handleChangeStepName = (event: React.ChangeEvent<HTMLInputElement>) => {
        // setStepName(event.currentTarget.value);

        const updatedData: BaseConfiguration = {
            ...node.data.configuration,
            title: event.currentTarget.value,
        };
        updateNodeDebounce(updatedData);
    };

    const handleChangeStepDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (event.currentTarget.value.length > MAX_DESCRIPTION_LENGHT) {
            setStepDescriptionExceedError(`Solo se puede introducir hasta ${MAX_DESCRIPTION_LENGHT} carácteres`);
            return;
        }

        // setStepDescription(event.currentTarget.value);
        setStepDescriptionExceedError("");

        const updatedData: BaseConfiguration = {
            ...node.data.configuration,
            comments: event.currentTarget.value,
        };
        updateNodeDebounce(updatedData);
    };

    const updateNodeDebounce = useCallback(
        debounce((updatedData) => updateLocalNode(nodeId, { configuration: updatedData }), 200),
        [nodeId]
    );

    return (
        <main className="flex flex-col gap-x-1 gap-y-6 py-8 px-6 text-gray-400">
            <TextInput name="stepname" value={stepName} label="Nombre" placeholder="Escribe un nombre" defaultValue={stepName} hasError="" labelClassName="" onChange={handleChangeStepName} />
            <div>
                <TextAreaInput
                    name="stepname"
                    value={stepDescription}
                    label="Descripción"
                    placeholder="Escribe una descripción"
                    defaultValue={stepDescription}
                    hasError={stepDescriptionExceedError}
                    labelClassName=""
                    onChange={handleChangeStepDescription}
                />
                <CircularProgress MAXIMUM_CHARACTERS={MAX_DESCRIPTION_LENGHT} MINIMUM_CHARACTERS={MIN_DESCRIPTION_LENGTH} countFieldLength={!isEmpty(stepDescription) ? stepDescription.length : 0} />
            </div>
        </main>
    );
};
