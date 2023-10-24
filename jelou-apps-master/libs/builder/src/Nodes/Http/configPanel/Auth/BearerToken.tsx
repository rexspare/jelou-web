import { debounce, get } from "lodash";
import { useReactFlow, type Node } from "reactflow";

import { TextInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { Http } from "@builder/modules/Nodes/Http/http.domain";

export const BearerTokenHttp = ({ nodeId }: { nodeId: string }) => {
    const dataNode = useReactFlow().getNode(nodeId) as Node<Http>;
    const { token = "" } = get(dataNode, "data.configuration.authentication") ?? {};
    const { updateLocalNode } = useCustomsNodes();

    const handleChangeText = debounce((e) => {
        const newConfiguration = {
            ...dataNode.data.configuration,
            authentication: {
                ...dataNode.data.configuration.authentication,
                token: e.target.value,
            },
        };

        updateLocalNode(dataNode.id, { configuration: newConfiguration });
    }, 800);

    return (
        <div className="px-6">
            <TextInput defaultValue={token} onChange={handleChangeText} hasError="" label="Token" name="token" placeholder="Ingrese el token" />
        </div>
    );
};
