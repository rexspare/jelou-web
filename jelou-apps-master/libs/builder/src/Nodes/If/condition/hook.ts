// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ow from "ow";

import debounce from "lodash/debounce";
import { useRef, useState } from "react";
import { Node, useReactFlow } from "reactflow";

import { Option } from "@builder/common/inputs/types.input";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { EMPTY_OR_NOT_OPERATORS, IF, Term } from "@builder/modules/Nodes/If/IF.domain";
import { IfConfiguration } from "@builder/modules/Nodes/If/IfConfiguration";
import { CONDITIONS_TYPE, NAMES_IF_INPUTS } from "@builder/modules/Nodes/If/constants.If-config";

export const useConditionForm = (nodeId: string) => {
    const formDataRef = useRef<HTMLFormElement>({} as HTMLFormElement);

    const node = useReactFlow().getNode(nodeId) as Node<IF>;
    const ifConfigurator = new IfConfiguration(node.data);

    const { updateLocalNode } = useCustomsNodes();
    const [conditionTypeSelected, setConditionTypeSelected] = useState<CONDITIONS_TYPE>();

    const [isOperatorEmptyOrNotEmpty, setIsOperatorEmptyOrNotEmpty] = useState<boolean>(false);

    const handleUpdateTerms = (newTerms: Term[]) => {
        const configurationTerms = ifConfigurator.updateTermsConfig(newTerms);
        updateLocalNode(nodeId, configurationTerms);
    };

    const handleChange = (termId: string, nameInput: NAMES_IF_INPUTS) => (optionSelected: Option<CONDITIONS_TYPE>) => {
        const formData = new window.FormData(formDataRef.current);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const termData = Object.fromEntries(formData) as Term;
        const newTermValue: Term = {
            ...termData,
            [nameInput]: optionSelected.value,
        };

        if (newTermValue?.operator === EMPTY_OR_NOT_OPERATORS.EMPTY || newTermValue?.operator === EMPTY_OR_NOT_OPERATORS.NOT_EMPTY) {
            setIsOperatorEmptyOrNotEmpty(true);
        } else {
            setIsOperatorEmptyOrNotEmpty(false);
        }

        if (nameInput === NAMES_IF_INPUTS.CONDITION_TYPE) setConditionTypeSelected(optionSelected.value);

        validateTerm(newTermValue)
            .then(() => {
                const newTerms = ifConfigurator.updateTerms(termId, newTermValue);
                handleUpdateTerms(newTerms);
            })
            .catch(() => null);
    };

    /**
     * Update the value of the term text input condition
     */
    const handleChangeText = (termId: string, nameInput: NAMES_IF_INPUTS) =>
        debounce((event: React.ChangeEvent<HTMLInputElement>) => {
            const formData = new window.FormData(formDataRef.current);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const termData = Object.fromEntries(formData) as Term;
            const newTermValue: Term = {
                ...termData,
                [nameInput]: event.target.value,
            };

            validateTerm(newTermValue)
                .then(() => {
                    const newTerms = ifConfigurator.updateTerms(termId, newTermValue);
                    handleUpdateTerms(newTerms);
                })
                .catch(() => null);
        }, 500);

    return { handleChange, handleChangeText, conditionTypeSelected, formDataRef, isOperatorEmptyOrNotEmpty };
};

async function validateTerm(term: unknown) {
    try {
        ow(
            term,
            ow.object.exactShape({
                type: ow.string.minLength(1),
                value1: ow.string.minLength(1),
                value2: ow.string.minLength(1),
                operator: ow.string.minLength(1),
            })
        );
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(Error("The term doesn't have the correct shape"));
    }
}
