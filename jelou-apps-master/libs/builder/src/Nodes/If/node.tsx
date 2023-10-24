import type { NodeProps } from "reactflow";

import { ConditionIcon } from "@builder/Icons";
import { IF, Term as TermType } from "@builder/modules/Nodes/If/IF.domain";
import { COMBINATIONS_OPTIONS } from "@builder/modules/Nodes/If/constants.If-config";
import { WrapperNode } from "../Wrapper";
import { IconsByOperator } from "./settings";

const styleNode = { bgHeader: "#9C5E91", textColorHeader: "#fff" };

export const IFNode = ({ data, id: nodeId, selected }: NodeProps<IF>) => {
    const { title, terms = [], operator } = data.configuration;

    const combinatorTitle = COMBINATIONS_OPTIONS.find((option) => option.value === operator)?.label;

    return (
        <WrapperNode title={title} nodeId={nodeId} selected={selected} styleNode={styleNode} showDefaultHandle={false} isActiveButtonsBlock={false} Icon={() => <ConditionIcon />}>
            {terms.map((term) => (
                <Term key={term.id} term={term} />
            ))}

            <div className="text-gray-400">
                <h3 className="mb-2 font-semibold">Combinar</h3>
                <p className="min-h-[2rem] rounded-10 bg-white px-2 py-2">{combinatorTitle ?? "Configura la combinación de las condiciones"}</p>
            </div>
        </WrapperNode>
    );
};

type TermProps = {
    term: TermType;
};

function Term({ term }: TermProps) {
    const { operator, value1, value2 } = term;

    const showCondition = value1 && value2 && operator;
    const Icon = IconsByOperator[operator];

    return (
        <div className="w-56 border-b-1 border-gray-330 pb-4 text-gray-400">
            <h3 className="mb-2 font-semibold">Condición</h3>
            <p className="min-h-[2rem] break-words rounded-10 bg-white px-2 py-2">
                {showCondition ? (
                    <>
                        {value1}
                        {Icon ? (
                            <span className="[&_svg]:inline">
                                <Icon />
                            </span>
                        ) : (
                            operator
                        )}
                        {value2}
                    </>
                ) : (
                    "Configura está condición"
                )}
            </p>
        </div>
    );
}
