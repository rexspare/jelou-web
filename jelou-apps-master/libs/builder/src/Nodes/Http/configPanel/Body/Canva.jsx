/** @typedef {import('../../../domain/nodes').HttpNode} HttpNodeData */
/** @typedef {import('reactflow').Node<HttpNodeData>} Node */

import { debounce, get } from "lodash";

import { TextAreaInput } from "../../../../common/inputs";
import { useCustomsNodes } from "../../../../hook/customNodes.hook";

/** @param {{dataNode: Node }} props */
export const CanvaBodyHttp = ({ dataNode }) => {
    const defaultValueText = get(dataNode, "data.configuration.body.content", "");
    const { updateLocalNode } = useCustomsNodes();

    /** @type {import('lodash').DebouncedFunc<(e: React.ChangeEvent<HTMLTextAreaElement> ) => void>} */
    const handleTextareaChange = debounce((e) => {
        const newConfiguration = {
            ...dataNode.data.configuration,
            body: {
                ...dataNode.data.configuration.body,
                content: e.target.value,
            },
        };

        updateLocalNode(dataNode.id, { configuration: newConfiguration });
    }, 800);

    return (
        <div className="px-6">
            <TextAreaInput className="h-64" defaultValue={defaultValueText} hasError="" label="" name="body" placeholder="Ingrese el body del request" onChange={handleTextareaChange} />
        </div>
    );
};
