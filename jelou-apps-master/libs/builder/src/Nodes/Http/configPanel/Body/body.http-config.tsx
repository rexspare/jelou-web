import get from "lodash/get";
import { Node, useReactFlow } from "reactflow";

import { InputSelector } from "@builder/common/inputs";
import { Option } from "@builder/common/inputs/types.input";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { CONTENT_TYPE_TYPES, HTTP_HEADER_KEY_NAME, HTTP_INPUTS_NAMES, contentTypeBodyOptions } from "@builder/modules/Nodes/Http/constants.http";
import { Http } from "@builder/modules/Nodes/Http/http.domain";

import { NoContent } from "../NoContent";
import { CanvaBodyHttp } from "./Canva";
import { JsonBodyHttp } from "./Json";
import { MultipartFormBodyHttp } from "./MultipartForm/Multipart-form";
import { XMLBodyHttp } from "./XML";

const renderBody: Record<string, (data: Node) => JSX.Element> = {
    [CONTENT_TYPE_TYPES.NO_CONTENT]: () => <NoContent message="Este request no necesita ningún contenido" />,
    [CONTENT_TYPE_TYPES.FORM_URL_ENCODED]: (data: Node<Http>) => <MultipartFormBodyHttp dataNode={data} />,
    [CONTENT_TYPE_TYPES.JSON]: (data: Node) => <JsonBodyHttp dataNode={data} />,
    [CONTENT_TYPE_TYPES.MULTIPART_FORM]: (data: Node<Http>) => <MultipartFormBodyHttp dataNode={data} />,
    [CONTENT_TYPE_TYPES.TEXT]: (data: Node<Http>) => <CanvaBodyHttp dataNode={data} />,
    [CONTENT_TYPE_TYPES.XML]: (data: Node) => <XMLBodyHttp dataNode={data} />,
};
const defaultConfig: Http["configuration"]["body"] = {
    type: CONTENT_TYPE_TYPES.NO_CONTENT,
    content: "",
    enabled: false,
};

type BodyHttpBlockProps = {
    nodeId: string;
};

export const BodyHttpBlock = ({ nodeId }: BodyHttpBlockProps) => {
    const { getNode } = useReactFlow();
    const node = getNode(nodeId) as Node<Http>;

    const { type } = get(node, "data.configuration.body") ?? defaultConfig;
    // const enabled = get(node, "data.configuration.body.enabled") ?? false;

    const render = renderBody[type];

    const { updateLocalNode } = useCustomsNodes();

    const handleChangeSelector = (optionSelected: Option) => {
        const node = getNode(nodeId) as Node<Http>;
        const configuration = node.data.configuration;

        const valueSelected = optionSelected.value;

        const headers = configuration.headers.map((header) => (header.id === HTTP_HEADER_KEY_NAME ? { ...header, value: valueSelected } : header));

        const newConfiguration = {
            ...configuration,
            body: {
                ...configuration.body,
                type: optionSelected.value,
                content: null,
                enabled: optionSelected.value !== CONTENT_TYPE_TYPES.NO_CONTENT,
            },
            headers,
        };

        updateLocalNode(node.id, { configuration: newConfiguration });
    };

    // const handleChangeEnabled = () => {
    //     const node = getNode(nodeId) as Node<Http>;
    //     const configuration = node.data.configuration;

    //     const newConfiguration = {
    //         ...configuration,
    //         body: {
    //             ...configuration.body,
    //             enabled: !configuration.body?.enabled ?? false,
    //         },
    //     };

    //     updateLocalNode(node.id, { configuration: newConfiguration });
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
                        label="Tipo de contenido:"
                        onChange={handleChangeSelector}
                        options={contentTypeBodyOptions}
                        name={HTTP_INPUTS_NAMES.CONTENT_TYPE}
                        placeholder="Escoge un tipo de contenido"
                    />
                </div>
            </div>

            {render && render(node)}
        </>
    );
};
