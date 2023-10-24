import type { Code } from "@builder/modules/Nodes/domain/nodes";
import type { NodeProps } from "reactflow";

import isEmpty from "lodash/isEmpty";
import Prism from "prismjs";
import { useEffect } from "react";

import { CodeIcon } from "@builder/Icons";
import { IF } from "@builder/common/Headless/conditionalRendering";
import { PreviewCode } from "@builder/common/code/Preview.code";
import { NODE_TYPES, TITLE_NODES } from "@builder/modules/Nodes/domain/constants";
import { WrapperNode } from "../Wrapper";

const styleNode = { bgHeader: "#D7B8FF", textColorHeader: "#36055C" };

export const CodeNode = ({ id: nodeId, selected, data }: NodeProps<Code>) => {
    const { title = TITLE_NODES[NODE_TYPES.CODE], content, description, collapsed } = data.configuration;

    useEffect(() => {
        Prism.highlightAll();
    }, [content, collapsed]);

    return (
        <WrapperNode title={title} nodeId={nodeId} selected={selected} styleNode={styleNode} Icon={() => <CodeIcon />} showDefaultHandle={false} isActiveButtonsBlock={false}>
            <IF condition={!isEmpty(description)}>
                <IF.Then>
                    <Message text={description} />
                </IF.Then>
            </IF>

            <div className="w-full max-w-[13.55rem]">
                <IF condition={!isEmpty(content)}>
                    <IF.Then>
                        <PreviewCode className="h-[10rem] overflow-hidden" showCopyBtn={false} highlight content={content} />
                    </IF.Then>
                    <IF.Else>
                        <Message />
                    </IF.Else>
                </IF>
            </div>
        </WrapperNode>
    );
};

function Message({ text = "Configura tu bloque de código" }) {
    return (
        <div className="shadow-nodo grid place-content-center rounded-10 border-1 border-gray-330 bg-white p-2 text-[#36055C]">
            <div
                dangerouslySetInnerHTML={{ __html: text }}
                className="h-64 space-y-3 overflow-hidden break-words [&_code]:rounded-md [&_code]:bg-gray-330 [&_code]:p-1 [&_h3]:font-semibold [&_li]:my-2 [&_ol]:ml-6 [&_ol]:!list-decimal [&_ul]:ml-6 [&_ul]:!list-disc"
            />
        </div>
    );
}
