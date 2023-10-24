import { debounce, get } from "lodash";
import { useReactFlow } from "reactflow";

import { EditorCode } from "../../../../common/code/Editor.code";
import { useCustomsNodes } from "../../../../hook/customNodes.hook";

// /** @param {{dataNode: Node }} props */
export const XMLBodyHttp = ({ dataNode }) => {
    const defaultValueText = get(dataNode, "data.configuration.body.content", "");
    const { updateLocalNode } = useCustomsNodes();
    const { getNode } = useReactFlow();

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
    }, 1000);

    return (
        <div className="px-6">
            <div className="w-[42rem] overflow-hidden rounded-10 border-1 border-gray-330">
                <EditorCode onChange={handleTextareaChange} defaultLanguage="html" defaultValue={defaultValueText} height="30rem" />
            </div>
        </div>
    );
};
