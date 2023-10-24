/** @typedef {import('../../../../common/inputs/types.inputs').option} Option */
/** @typedef {import('../../../domain/nodes').HttpNode} HttpNodeData */
/** @typedef {import('reactflow').Node<HttpNodeData>} Node */

import get from "lodash/get";
import { useReactFlow } from "reactflow";

import { InputSelector } from "../../../../common/inputs";
import { useCustomsNodes } from "../../../../hook/customNodes.hook";
import { CONTENT_TYPE_TYPES, HTTP_HEADER_KEY_NAME, HTTP_INPUTS_NAMES, contentTypeBodyOptions } from "../../constants.http";

import { CanvaBodyHttp } from "./Canva";
import { JsonBodyHttp } from "./Json";
import { MultipartFormBodyHttp } from "./MultipartForm/Multipart-form";
import { XMLBodyHttp } from "./XML";

/** @type {Record<string, (data: Node) => JSX.Element>} */
const renderBody = {
    [CONTENT_TYPE_TYPES.FORM_URL_ENCODED]: (data) => <MultipartFormBodyHttp dataNode={data} />,
    [CONTENT_TYPE_TYPES.JSON]: (data) => <JsonBodyHttp dataNode={data} />,
    [CONTENT_TYPE_TYPES.MULTIPART_FORM]: (data) => <MultipartFormBodyHttp dataNode={data} />,
    [CONTENT_TYPE_TYPES.TEXT]: (data) => <CanvaBodyHttp dataNode={data} />,
    [CONTENT_TYPE_TYPES.XML]: (data) => <XMLBodyHttp dataNode={data} />,
};

/** @type {HttpNodeData['configuration']['body']} */
const defaultConfig = {
    type: "",
    content: null,
};

export const BodyHttpBlock = ({ nodeId }) => {
    const { getNode } = useReactFlow();
    const node = getNode(nodeId);
    const { type = "" } = get(node, "data.configuration.body", defaultConfig);
    const render = renderBody[type];

    const { updateLocalNode } = useCustomsNodes();

    /**
     * @param {Option} optionSelected
     */
    const handleChangeSelector = (optionSelected) => {
        const valueSelected = optionSelected.value;

        const headers = node.data.configuration.headers.map((header) => (header.id === HTTP_HEADER_KEY_NAME ? { ...header, value: valueSelected } : header));

        const newConfiguration = {
            ...node.data.configuration,
            body: {
                type: optionSelected.value,
                content: null,
                enabled: true,
            },
            headers,
        };

        updateLocalNode(node.id, { configuration: newConfiguration });
    };

    return (
        <>
            <div className="p-6">
                <InputSelector
                    hasError=""
                    inline
                    label="Tipo de contenido:"
                    name={HTTP_INPUTS_NAMES.CONTENT_TYPE}
                    options={contentTypeBodyOptions}
                    color="#006757"
                    defaultValue={type}
                    placeholder="Escoge un tipo de contenido"
                    onChange={handleChangeSelector}
                />
            </div>

            {render && render(node)}
        </>
    );
};
