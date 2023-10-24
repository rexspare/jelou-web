import type { BasicAuth, Http } from "@builder/modules/Nodes/Http/http.domain";

import { debounce } from "lodash";
import { useReactFlow, type Node } from "reactflow";

import { useCustomsNodes } from "@builder/hook/customNodes.hook";

export const useBasicAuthHttp = (nodeId: string) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<Http>;
    const { updateLocalNode } = useCustomsNodes();

    const updateBasicAuth = (newData: BasicAuth) => {
        const newConfiguration = {
            ...currentNode.data.configuration,
            authentication: {
                ...currentNode.data.configuration.authentication,
                username: newData.username,
                password: newData.password,
            },
        };

        updateLocalNode(currentNode.id, { configuration: newConfiguration });
    };

    const handleInputChange = (formRef: React.MutableRefObject<HTMLFormElement>) =>
        debounce((e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            const formData = new FormData(formRef.current) as unknown as Iterable<[object, FormDataEntryValue]>;
            const data = Object.fromEntries(formData);

            updateBasicAuth(data as BasicAuth);
        }, 500);

    return { handleInputChange };
};
