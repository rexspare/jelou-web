import { Handle, NodeProps, Position } from "reactflow";

import { ConditionIcon } from "@builder/Icons";
import { PREFIX_SOURCE_IF_ERROR_NODE, PREFIX_SOURCE_SUCCESS } from "@builder/constants.local";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";
import { ConditionNode, ConditionalIconsByOperator, ConditionalTerm } from "@builder/modules/Nodes/Conditional/domain/conditional.domain";
import { ConditionConfiguration } from "@builder/modules/Nodes/Conditional/infrastructure/ConditionalConfig";
// import { Term as TermType } from "@builder/modules/Nodes/If/IF.domain";

// import { IconsByOperator } from "../If/settings";
import { WrapperNode } from "../Wrapper";

const styleNode = { bgHeader: "#fff", textColorHeader: "#00B3C7" };

export const ConditionalNode = ({ id: nodeId, selected, data }: NodeProps<ConditionNode>) => {
    const { title, conditions } = data.configuration;
    const onConnect = useOnConnect();

    return (
        <WrapperNode title={title} nodeId={nodeId} styleNode={styleNode} isActiveButtonsBlock={false} showDefaultHandle={false} selected={selected} Icon={() => <ConditionIcon />}>
            {conditions &&
                conditions.length > 0 &&
                conditions.map((condition) => {
                    const isDefaultCondition = condition.id === ConditionConfiguration.defaultCondition;
                    const handleClassType = isDefaultCondition ? "targetsHandlesError" : "targetsHandlesSucces";
                    const typeEdge = isDefaultCondition ? EDGES_TYPES.ERROR : EDGES_TYPES.SUCCESS;
                    const nodeStyle = { backgroundColor: isDefaultCondition ? "#FDEFED" : "#E2FED4" };
                    const handleId = `${isDefaultCondition ? PREFIX_SOURCE_IF_ERROR_NODE : PREFIX_SOURCE_SUCCESS}${condition.id}`;

                    return (
                        <div key={condition.id} className="flex justify-between bg-white rounded-md">
                            <div className="h-fit min-w-[2rem] p-3 text-gray-400">
                                <p className="text-xs text-[#374361]">{isDefaultCondition ? "Si no" : condition.name}</p>
                                {!isDefaultCondition && condition.terms.map((term) => <Term key={term.id} term={term} />)}
                            </div>
                            <div style={nodeStyle} className="relative w-6 rounded-r-md bg-green-450">
                                <Handle
                                    id={handleId}
                                    style={{ position: "relative", margin: "0" }}
                                    type="source"
                                    position={Position.Right}
                                    className={handleClassType}
                                    onConnect={onConnect({ type: typeEdge })}
                                />
                            </div>
                        </div>
                    );
                })}
        </WrapperNode>
    );
};

type TermProps = {
    term: ConditionalTerm;
};

const Term = ({ term }: TermProps) => {
    const { operator, value1, value2 } = term;

    const showCondition = value1 || operator;
    const Icon = ConditionalIconsByOperator[operator];

    return (
        <p className="w-40 px-1 py-1 text-xs text-gray-400 break-words bg-white h-fit rounded-10">
            {showCondition ? (
                <>
                    {value1}{" "}
                    {Icon ? (
                        <span className="[&_svg]:inline">
                            <Icon />
                        </span>
                    ) : (
                        operator
                    )}{" "}
                    {value2}
                </>
            ) : (
                "Configura está condición"
            )}
        </p>
        // </div>
    );
};
