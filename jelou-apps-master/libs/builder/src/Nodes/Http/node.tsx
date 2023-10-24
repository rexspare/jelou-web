import type { NodeProps } from "reactflow";

import { HttpIcon } from "@builder/Icons";
import { Http } from "@builder/modules/Nodes/Http/http.domain";
import { WrapperNode } from "../Wrapper";

const styleWrapperNode = { bgHeader: "#006757", textColorHeader: "#fff" };

export const HttpNode = ({ data, id: nodeId, selected }: NodeProps<Http>) => {
    const { title = "", url, method, output } = data.configuration;

    return (
        <WrapperNode title={title} nodeId={nodeId} selected={selected} showDefaultHandle={false} Icon={() => <HttpIcon />} isActiveButtonsBlock={false} styleNode={styleWrapperNode}>
            <h4 className="font-medium text-gray-400">Metodo</h4>
            <p className="min-h-[2rem] rounded-10 border-1 border-gray-330 bg-white px-2 py-2 text-13">
                {method ? <span className="text-gray-400">{method}</span> : <span className="text-gray-340 ">Elige un metodo http</span>}
            </p>
            <h4 className="font-medium text-gray-400">Variable</h4>
            <p className="min-h-[2rem] w-56 break-words rounded-10 border-1 border-gray-330 bg-white px-2 py-2 text-13">
                {output ? <span className="text-gray-400">{output}</span> : <span className="text-gray-340 ">Define una variable de salida</span>}
            </p>
            <h4 className="font-medium text-gray-400">URL</h4>
            <p className="min-h-[2rem] rounded-10 border-1 border-gray-330 bg-white px-2 py-2 text-13">
                {url ? <span className="w-[12.6rem] break-words text-gray-400 line-clamp-4">{url}</span> : <span className="text-gray-340 ">Configura una URL</span>}
            </p>
        </WrapperNode>
    );
};
