import { useMemo } from "react";
import { Node, useReactFlow } from "reactflow";

import { CloseIcon } from "@builder/Icons";
import { InputSelector } from "@builder/common/inputs";
import { IF } from "@builder/modules/Nodes/If/IF.domain";
import { COMBINATIONS_OPTIONS, COMBINATION_COMMENT, NAMES_IF_INPUTS } from "@builder/modules/Nodes/If/constants.If-config";
import { ConditionForm } from "./condition/form";
import { useIFconfig } from "./config.hook";

type IfNode = Node<IF>;

type Props = {
    nodeId: IfNode["id"];
};

export const IFConfig = ({ nodeId }: Props) => {
    const node = useReactFlow().getNode(nodeId) as IfNode;
    const { terms = [], operator } = node.data.configuration;
    const combinationComment = useMemo(() => COMBINATION_COMMENT[operator], [operator]);

    const { handleChangeCombination, handleAddNewTerm, deleteBlockCondition } = useIFconfig(nodeId);

    return (
        <main className="flex h-[90%] flex-col justify-between gap-3 p-7 text-gray-400">
            <div className="mb-8 space-y-3">
                <InputSelector
                    inline
                    hasError=""
                    label="Combinación de condiciones: "
                    name={NAMES_IF_INPUTS.OPERATOR}
                    options={COMBINATIONS_OPTIONS}
                    defaultValue={operator}
                    placeholder="Selecciona una conbinación de condiciones"
                    onChange={handleChangeCombination}
                />

                {combinationComment && <p className="rounded-12 border-1 border-gray-230 p-3 text-13 shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)]">{combinationComment}</p>}
            </div>
            <div className="flex-1 space-y-3 overflow-y-scroll pt-1">
                {terms &&
                    terms.map((term) => {
                        const { id } = term;
                        return (
                            <div key={id} className="flex items-center gap-2 ">
                                <ConditionForm term={term} nodeId={nodeId} />
                                <button className="text-gray-400/50 hover:text-purple-650" onClick={deleteBlockCondition(id)}>
                                    <span className="sr-only">deleteCondition</span>
                                    <CloseIcon width={12} />
                                </button>
                            </div>
                        );
                    })}
                <button onClick={handleAddNewTerm()} className="font-semibold text-purple-650">
                    + Agregar condicional
                </button>
            </div>
        </main>
    );
};
