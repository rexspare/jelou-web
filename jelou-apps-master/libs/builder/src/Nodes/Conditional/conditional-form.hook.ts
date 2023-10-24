// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ow from "ow";

import { debounce } from "lodash";
import { useRef, useState } from "react";
import { Node, useReactFlow } from "reactflow";

// import { Option } from "@builder/common/inputs/types.input";
import { ListBoxElement } from "@builder/common/Headless/Listbox";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { Condition, ConditionNode, ConditionalInputName, ConditionalOperator, ConditionalTerm, OptionFilterName } from "@builder/modules/Nodes/Conditional/domain/conditional.domain";
import { useConditionalConfig } from "@builder/modules/Nodes/Conditional/infrastructure/config.hook";

type Props = {
    nodeId: string;
    term: ConditionalTerm;
};

export function useConditionalTermForm({ nodeId, term }: Props) {
    const formDataRef = useRef<HTMLFormElement>({} as HTMLFormElement);

    const node = useReactFlow().getNode(nodeId) as Node<ConditionNode>;
    const { updateLocalNode } = useCustomsNodes();
    const { updateConditions } = useConditionalConfig({ nodeId });
    // const [conditionTypeSelected, setConditionTypeSelected] = useState<CONDITIONS_TYPE>();

    const [showOperatorInputSelector, setShowOperatorInputSelector] = useState<boolean>(() => {
        return term.operator === ConditionalOperator.IS || term.operator === ConditionalOperator.IS_NOT;
    });
    const [isOperatorEmptyOrNotEmpty, setIsOperatorEmptyOrNotEmpty] = useState<boolean>(() => {
        return term?.operator === ConditionalOperator.IS_EMPTY || term?.operator === ConditionalOperator.IS_NOT_EMPTY;
    });

    const handleUpdateTerms = (condition: Condition, newTerms: ConditionalTerm[]) => {
        const conditionToUpdate = structuredClone(condition);
        conditionToUpdate.terms = newTerms;
        const conditionsUpdated = updateConditions(conditionToUpdate);
        updateLocalNode(nodeId, { configuration: { ...node.data.configuration, conditions: conditionsUpdated } });
    };

    const handleChange = (condition: Condition, termId: string, nameInput: ConditionalInputName) => (optionSelected: ListBoxElement) => {
        const formData = new window.FormData(formDataRef.current) as unknown as Iterable<[object, FormDataEntryValue]>;
        const termData = Object.fromEntries(formData) as ConditionalTerm;
        const newTermValue: ConditionalTerm = {
            ...termData,
            [nameInput]: optionSelected.value,
        };

        const operatorEmptyStatus = newTermValue?.operator === ConditionalOperator.IS_EMPTY || newTermValue?.operator === ConditionalOperator.IS_NOT_EMPTY;
        setIsOperatorEmptyOrNotEmpty(operatorEmptyStatus);

        if (operatorEmptyStatus) {
            newTermValue.type = undefined;
            newTermValue.value2 = "";
        }

        const showOperatorInputSelector = newTermValue.operator === ConditionalOperator.IS || newTermValue.operator === ConditionalOperator.IS_NOT;
        setShowOperatorInputSelector(showOperatorInputSelector);

        // validateTerm(newTermValue)
        //     .then(() => {
        const newTerms = updateTerms(condition, termId, newTermValue);
        handleUpdateTerms(condition, newTerms);
        // })
        // .catch(() => null);
    };

    const handleChangeText = (condition: Condition, termId: string, nameInput: ConditionalInputName) =>
        debounce((event: React.ChangeEvent<HTMLInputElement>) => {
            const formData = new window.FormData(formDataRef.current);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const termData = Object.fromEntries(formData) as ConditionalTerm;
            const newTermValue: ConditionalTerm = {
                ...termData,
                [nameInput]: event.target.value,
            };

            // validateTerm(newTermValue)
            // .then(() => {
            const newTerms = updateTerms(condition, termId, newTermValue);
            handleUpdateTerms(condition, newTerms);
            // })
            // .catch(() => null);
        }, 500);

    const updateTerms = (condition: Condition, termId: string, newTermValue: ConditionalTerm) => {
        const numberOperators = [ConditionalOperator.LARGER, ConditionalOperator.LARGER_EQUAL, ConditionalOperator.SMALLER, ConditionalOperator.SMALLER_EQUAL];
        const isConditionTypeNumber = numberOperators.includes(newTermValue.operator);

        const comparatorOperators = [ConditionalOperator.IS, ConditionalOperator.IS_NOT];
        const isConditionComparator = comparatorOperators.includes(newTermValue.operator);
        if (isConditionComparator) newTermValue.type = newTermValue.value2 as OptionFilterName;

        return condition.terms.map((term) =>
            term.id === termId
                ? {
                      ...term,
                      ...newTermValue,
                      value2: isConditionTypeNumber ? Number(newTermValue.value2) : newTermValue.value2,
                  }
                : term
        );
    };

    return { formDataRef, handleChangeText, handleChange, isOperatorEmptyOrNotEmpty, showOperatorInputSelector };
}

// async function validateTerm(term: unknown) {
//     try {
//         ow(
//             term,
//             ow.object.exactShape({
//                 // type: ow.string.minLength(1),
//                 value1: ow.string.minLength(1),
//                 value2: ow.string.minLength(1),
//                 operator: ow.string.minLength(1),
//             })
//         );
//         return Promise.resolve();
//     } catch (error) {
//         return Promise.reject(Error("The term doesn't have the correct shape"));
//     }
// }
