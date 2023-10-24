import { Node, useReactFlow } from "reactflow";

import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { useCallback } from "react";
import { Condition, ConditionNode, ConditionalTerm } from "../domain/conditional.domain";
import { ConditionConfiguration } from "./ConditionalConfig";

type Props = {
    nodeId: string;
};
export function useConditionalConfig({ nodeId }: Props) {
    const node = useReactFlow().getNode(nodeId) as Node<ConditionNode>;
    const { conditions = [] } = node.data.configuration || {};

    const { updateLocalNode } = useCustomsNodes();

    const updateConditions = useCallback((condition: Condition) => conditions.map((value) => (value.id === condition.id ? condition : value)), [conditions]);

    const saveCondition = useCallback((updatedConditions: Condition[]) => {
        const newConfiguration = {
            configuration: {
                ...node.data.configuration,
                conditions: updatedConditions,
            },
        };

        updateLocalNode(nodeId, newConfiguration);
    }, []);

    // TODO @julioam28: refactor this!
    const handleUpdateTerms = (condition: Condition, newTerms: ConditionalTerm[]) => {
        const updatedConditions = updateConditions({ ...condition, terms: newTerms });
        saveCondition(updatedConditions);
    };

    // const handleChangeConditionCombination = (condition: Condition, optionSelected: Option<Operator>) => {
    //     const updatedConditions = updateConditions({ ...condition, operator: optionSelected.value });
    //     saveCondition(updatedConditions);
    // };

    const handleChangeConditionName = (condition: Condition, name: string) => {
        const updatedConditions = updateConditions({ ...condition, name });
        saveCondition(updatedConditions);
    };

    const handleDeleteCondition = (conditionId: string) => {
        const updatedConditions = conditions.filter((condition) => condition.id !== conditionId);
        saveCondition(updatedConditions);
    };

    const handleCollapsedCondition = (condition: Condition) => {
        const updatedConditions = updateConditions({ ...condition, conditionPanelCollapsed: !condition.conditionPanelCollapsed });
        saveCondition(updatedConditions);
    };

    const handleAddNewTerm = (condition: Condition) => {
        const newTerm = ConditionConfiguration.getNewTerm();
        handleUpdateTerms(condition, [...condition.terms, newTerm]);
    };

    const handleDeleteTerm = (condition: Condition, termId: string) => {
        const newTerms = condition.terms.filter((term) => term.id !== termId);
        handleUpdateTerms(condition, newTerms);
    };

    const handleAddNewCondition = () => {
        const newCondition = ConditionConfiguration.generateNewCondition();
        const defaultConditionIndex = conditions.findIndex((condition) => condition.id === ConditionConfiguration.defaultCondition);
        const tempDefaultCondition = conditions[defaultConditionIndex];
        conditions.splice(defaultConditionIndex, 1);
        const updatedConditions = [...conditions, newCondition, tempDefaultCondition];

        saveCondition(updatedConditions);
    };

    return {
        conditions,
        node,
        updateConditions,
        handleAddNewCondition,
        handleDeleteTerm,
        handleAddNewTerm,
        handleCollapsedCondition,
        handleDeleteCondition,
        // handleChangeConditionCombination,
        handleChangeConditionName,
    };
}
