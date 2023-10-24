import type { SelectInstance } from "react-select";
import type { Node } from "reactflow";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ow from "ow";

import { get } from "lodash";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { useReactFlow } from "reactflow";

import { Option } from "@builder/common/inputs/types.input";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { parseCurl } from "@builder/libs/cruls/parse";
import { HTTP_INPUTS_NAMES, HTTP_METHODS_OPTIONS } from "@builder/modules/Nodes/Http/constants.http";
import { Http } from "@builder/modules/Nodes/Http/http.domain";

// type InputTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => void;
type HttpNode = Node<Http>;

export const useHttpConfig = (nodeId: string) => {
    const [loadingCurl, setLoadingCurl] = useState(false);

    const { updateLocalNode } = useCustomsNodes();
    const { getNode } = useReactFlow();

    const inputURLRef = useRef<HTMLInputElement>(null);
    const selectorRef = useRef<SelectInstance>(null);

    const handleChangeSelector = (inputName: string) => (optionSelected: Option) => {
        const currentNode = getNode(nodeId) as HttpNode;

        const newConfiguration = {
            ...(get(currentNode, "data.configuration") || {}),
            [inputName]: optionSelected.value,
        };

        // validateSimpleHttp(newConfiguration)
        // .then(() =>
        updateLocalNode(nodeId, { configuration: newConfiguration });
        // )
        // .catch(() => null);
    };

    const handleChangeInputText = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const currentNode = getNode(nodeId) as HttpNode;
        const { name, value } = evt.target;

        if (name === HTTP_INPUTS_NAMES.URL && value.startsWith("curl")) {
            // eslint-disable-next-line no-debugger
            // debugger;
            setLoadingCurl(true);
            const newConfiguration = configCurlHttp(value, currentNode, inputURLRef, selectorRef);
            console.log({ value, newConfiguration });
            updateLocalNode(nodeId, { configuration: newConfiguration }).finally(() => setLoadingCurl(false));
            return;
        }

        const newConfiguration = {
            ...currentNode.data.configuration,
            [name]: value,
        };

        // validateSimpleHttp(newConfiguration)
        //   .then(() => {
        updateLocalNode(nodeId, { configuration: newConfiguration });
        // })
        // .catch(() => null);
    };
    // }, 500);

    return { handleChangeSelector, handleChangeInputText, inputURLRef, selectorRef, loadingCurl };
};

// const validateSimpleHttp = (configuration: Partial<Http["configuration"]>) => {
//     try {
//         ow(configuration.url, ow.string.url.message("La url no es valida"));
//         ow(configuration.method, ow.string.minLength(1).message("The method is required"));
//         return Promise.resolve();
//     } catch (error) {
//         return Promise.reject(error);
//     }
// };

export function configCurlHttp(curlCommand: string, currentNode: HttpNode, inputURLRef: React.RefObject<HTMLInputElement>, selectorRef: React.RefObject<SelectInstance>) {
    const data = parseCurl(curlCommand);

    const parseHeaders = Object.entries(data.header).map(([key, value]) => ({
        enabled: true,
        id: nanoid(),
        key,
        value,
    }));

    const parseQueryParams = Object.entries(data.queryParams).map(([key, value]) => ({
        enabled: true,
        id: nanoid(),
        key,
        value,
    }));

    const newConfiguration = {
        ...currentNode.data.configuration,
        headers: parseHeaders,
        parameters: parseQueryParams,
        url: get(data, "url", ""),
        method: get(data, "method", ""),
        body: {
            ...currentNode.data.configuration.body,
            content: JSON.stringify(get(data, "data", ""), null, 2),
        },
    };

    if (inputURLRef.current) {
        inputURLRef.current.value = data.url;
    }

    if (selectorRef.current) {
        const newOption = HTTP_METHODS_OPTIONS.find((option) => option.value === data.method);
        selectorRef.current.setState({ selectValue: [newOption] });
    }

    return newConfiguration;
}
