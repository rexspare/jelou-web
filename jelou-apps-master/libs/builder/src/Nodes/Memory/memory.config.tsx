import { ChangeEvent } from "react";
import { useReactFlow, Node } from "reactflow";

import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { IMemoryNode } from "@builder/modules/Nodes/Memory/domain/memory.domain";
import { TextInput } from "@builder/common/inputs";

type MemoryInputName = "variable" | "value";

export const MemoryNodeConfig = ({ nodeId }: { nodeId: string }) => {
    const { updateLocalNode } = useCustomsNodes();
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<IMemoryNode>;
    const { variable = "", value = "" } = currentNode.data.configuration;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>, inputName: MemoryInputName) => {
        const newConfiguration = {
            ...currentNode.data.configuration,
            [inputName]: event.currentTarget.value,
        } as IMemoryNode["configuration"];

        updateLocalNode(nodeId, { configuration: newConfiguration });
    };

    return (
        <main className="flex flex-col gap-y-5 border-t-1 border-gray-230 p-6">
            <TextInput label="Nombre de la variable" value={variable} placeholder="Nombre de la variable" onChange={(event) => handleInputChange(event, "variable")} />
            <TextInput label="Valor de la variable" value={value} placeholder="Valor de la variable" onChange={(event) => handleInputChange(event, "value")} />
        </main>
    );
};
