import type { InputNode as InputNodeType } from "@builder/modules/Nodes/domain/nodes";

import { Node, useReactFlow } from "reactflow";

import CircularProgress from "@builder/common/CircularProgressbar";
import { CheckboxInput, TextAreaInput, TextInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { getBodyMessageMaxLength } from "@builder/modules/Nodes/message/domain/sizeMessage.validation";
import isEmpty from "lodash/isEmpty";
const INPUTS_NAMES = {
    PROMPT: "prompt",
    VARIABLE: "variable",
    USEMEMORY: "useMemory",
};

type InputConfigNodeProps = {
    nodeId: string;
};

export const InputConfigNode = ({ nodeId }: InputConfigNodeProps) => {
    const dataNode = useReactFlow().getNode(nodeId) as Node<InputNodeType>;
    const { prompt, variable, useMemory } = dataNode.data.configuration;
    const { getNode } = useReactFlow();
    const { updateLocalNode } = useCustomsNodes();
    const maxLength = getBodyMessageMaxLength();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value, name } = event.target;
        const currentNode = getNode(nodeId) as Node<InputNodeType>;
        const newConfiguration = {
            configuration: {
                ...currentNode.data.configuration,
                [name]: value,
            },
        };
        updateLocalNode(currentNode.id, newConfiguration);
    };
    const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, name } = event.target;
        const currentNode = getNode(nodeId) as Node<InputNodeType>;

        const newConfiguration = {
            configuration: {
                ...currentNode.data.configuration,
                [name]: checked,
            },
        };

        updateLocalNode(currentNode.id, newConfiguration);
    };

    return (
        <main className="grid gap-4 p-6 text-13 text-gray-400">
            <div className="[&_textarea]:h-72">
                <TextAreaInput onChange={handleChange} value={prompt} placeholder="Escribe tú mensaje de pregunta" name={INPUTS_NAMES.PROMPT} />
                <CircularProgress MAXIMUM_CHARACTERS={maxLength} MINIMUM_CHARACTERS={0} countFieldLength={!isEmpty(prompt) ? prompt.length : 0} />
            </div>

            <div className="[&_label_span]:mb-2">
                <TextInput label="Guardar respuesta con la variable" name={INPUTS_NAMES.VARIABLE} placeholder="Escribe el nombre de la variable" value={variable} onChange={handleChange} />
            </div>
            <div>
                <CheckboxInput
                    defaultChecked={useMemory}
                    className={"checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"}
                    name={INPUTS_NAMES.USEMEMORY}
                    label="No volver a preguntar"
                    labelClassName="font-medium"
                    onChange={handleChangeCheckbox}
                />
            </div>
        </main>
    );
};
