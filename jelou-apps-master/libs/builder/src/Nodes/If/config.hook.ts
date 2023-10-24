import { Node, useReactFlow } from "reactflow";

import type { Option } from "@builder/common/inputs/types.input";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { IF, Operator, Term } from "@builder/modules/Nodes/If/IF.domain";
import { IfConfiguration } from "@builder/modules/Nodes/If/IfConfiguration";

export function useIFconfig(nodeId: string) {
    const node = useReactFlow().getNode(nodeId) as Node<IF>;
    const ifConfigurator = new IfConfiguration(node.data);

    const { updateLocalNode } = useCustomsNodes();

    const handleUpdateTerms = (newTerms: Term[]) => {
        const configurationTerms = ifConfigurator.updateTermsConfig(newTerms);
        updateLocalNode(nodeId, configurationTerms);
    };

    const handleChangeCombination = (optionSelected: Option<Operator>) => {
        const newConfiguration = ifConfigurator.updataOperatorConfig(optionSelected.value);
        updateLocalNode(nodeId, newConfiguration);
    };

    const handleAddNewTerm = () => () => {
        const newTerms = ifConfigurator.AddNewTerm();
        handleUpdateTerms(newTerms);
    };

    const deleteBlockCondition = (termId: string) => (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        evt.preventDefault();
        const deletedTerms = ifConfigurator.deleteTerm(termId);
        handleUpdateTerms(deletedTerms);
    };

    return { handleChangeCombination, handleAddNewTerm, deleteBlockCondition };
}
