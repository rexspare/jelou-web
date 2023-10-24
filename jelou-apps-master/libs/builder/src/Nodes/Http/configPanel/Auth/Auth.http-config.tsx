import type { Option } from "@builder/common/inputs/types.input";
import type { Node } from "reactflow";

import get from "lodash/get";
import { useReactFlow } from "reactflow";

import { InputSelector } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { AUTH_TYPES, AUTH_TYPES_OPTIONS, CONTENT_TYPE_TYPES } from "@builder/modules/Nodes/Http/constants.http";
import { Http } from "@builder/modules/Nodes/Http/http.domain";

import { NoContent } from "../NoContent";
import { BasicHttp } from "./Basic";
import { BearerTokenHttp } from "./BearerToken";

const renderBody: Record<string, (nodeId: string) => JSX.Element> = {
    [AUTH_TYPES.NO_AUTH]: () => <NoContent message="Este request no necesita autenticación" />,
    [AUTH_TYPES.BASIC]: (nodeId) => <BasicHttp nodeId={nodeId} />,
    [AUTH_TYPES.BEARER_TOKEN]: (nodeId) => <BearerTokenHttp nodeId={nodeId} />,
};

const defaultConfig: Http["configuration"]["body"] = {
    type: CONTENT_TYPE_TYPES.JSON,
    content: "",
    enabled: false,
};

type AuthHttpConfigProps = {
    nodeId: string;
};

export const AuthHttpConfig = ({ nodeId }: AuthHttpConfigProps) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<Http>;

    const { type } = get(currentNode, "data.configuration.authentication") ?? defaultConfig;
    const render = renderBody[type];

    const { updateLocalNode } = useCustomsNodes();

    const handleAuthChange = (valueSelected: Option) => {
        const currentNode = getNode(nodeId) as Node<Http>;
        const configuration = currentNode.data.configuration;

        const newConfiguration = {
            ...configuration,
            authentication: {
                type: valueSelected.value,
                enabled: valueSelected.value !== AUTH_TYPES.NO_AUTH,
            },
        };

        updateLocalNode(currentNode.id, { configuration: newConfiguration });
    };

    // const handleChangeEnabled = () => {
    //     const currentNode = getNode(nodeId) as Node<Http>;
    //     const configuration = currentNode.data.configuration;

    //     const newConfiguration = {
    //         ...configuration,
    //         authentication: {
    //             ...configuration.authentication,
    //             enabled: configuration.authentication?.enabled ?? false,
    //         },
    //     };

    //     updateLocalNode(nodeId, { configuration: newConfiguration });
    // };

    return (
        <>
            <div className="flex w-full items-center gap-4 p-6">
                {/* <CheckboxInput hasError="" label="" name="enabledCheck" labelClassName="block" onChange={handleChangeEnabled} className="checked:text-teal-953" defaultChecked={enabled} /> */}
                <div className="w-[35rem]">
                    <InputSelector
                        inline
                        hasError=""
                        color="#006757"
                        defaultValue={type}
                        name="authType"
                        onChange={handleAuthChange}
                        options={AUTH_TYPES_OPTIONS}
                        label="Tipo de Autenticación:"
                        placeholder="Escoge un tipo de autenticación"
                    />
                </div>
            </div>

            {render && render(currentNode?.id)}
        </>
    );
};
