import { debounce, get } from "lodash";
import { useReactFlow } from "reactflow";

import { CUSTOM_LANGUAGE_ID } from "@builder/common/code/CustomLanguaje.Editor";
import { EditorCode } from "@builder/common/code/Editor.code";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";

export const JsonBodyHttp = ({ dataNode }) => {
    const { getNode } = useReactFlow();
    const current = getNode(dataNode.id);

    const defaultValueText = get(current, "data.configuration.body.content", "");
    const { updateLocalNode } = useCustomsNodes();

    /** @type {import('lodash').DebouncedFunc<(value: string, _: any ) => void>} */
    const handleTextareaChange = debounce((value, _) => {
        const currentNode = getNode(dataNode.id);
        const newConfiguration = {
            ...currentNode.data.configuration,
            body: {
                ...currentNode.data.configuration.body,
                content: value,
            },
        };

        updateLocalNode(dataNode.id, { configuration: newConfiguration });
    }, 500);

    return (
        <div className="px-6">
            <div className="w-[42rem] overflow-hidden rounded-10 border-1 border-gray-330">
                <EditorCode height="30rem" defaultValue={defaultValueText} onChange={handleTextareaChange} defaultLanguage={CUSTOM_LANGUAGE_ID} />
            </div>
        </div>
    );
};
