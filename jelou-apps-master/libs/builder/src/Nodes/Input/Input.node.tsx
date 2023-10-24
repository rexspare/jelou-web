import type { InputNode as InputNodeType } from "@builder/modules/Nodes/domain/nodes";
import type { NodeProps } from "reactflow";

import { QuestionIcon } from "@builder/Icons";
import { WrapperNode } from "../Wrapper";
import { CheckboxInput } from "@builder/common/inputs";

const styleNode = { bgHeader: "#E6F6FA", textColorHeader: "#00A2CF" };

export const InputNode = ({ id, data, selected }: NodeProps<InputNodeType>) => {
    const { title, prompt, variable, useMemory } = data.configuration;

    return (
        <WrapperNode nodeId={id} isActiveButtonsBlock={false} selected={selected} Icon={() => <QuestionIcon />} title={title} styleNode={styleNode}>
            <div className="shadow-nodo min-h-[7rem] w-56 overflow-hidden break-words rounded-10 bg-white p-2 text-13">
                <p>{prompt ? <span className="leading-[1.5] text-gray-400 [white-space:_break-spaces]">{prompt}</span> : <span className="text-gray-340 ">Agrega una pregunta</span>}</p>
            </div>
            {variable && (
                <label className="block w-56 break-words text-sm text-gray-400">
                    <span className="font-semibold">Variable: </span>
                    {variable}
                </label>
            )}

            <label className="flex text-sm text-gray-400 first-of-type:space-x-2 ">
                <span className="text-sm font-semibold ">No volver a preguntar</span>
                <CheckboxInput
                    defaultChecked={useMemory}
                    className={" group -translate-x-2 checked:bg-primary-200 hover:checked:bg-primary-200 focus:ring-primary-200 focus:ring-opacity-25 focus:checked:bg-primary-200"}
                    name="useMemory"
                    disabled={true}
                    labelClassName="font-medium"
                />
            </label>
        </WrapperNode>
    );
};
