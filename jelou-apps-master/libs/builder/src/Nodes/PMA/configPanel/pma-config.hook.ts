import type { PMANode } from "@builder/modules/Nodes/domain/nodes";

import get from "lodash/get";
import { useState } from "react";
import { useReactFlow, type Node } from "reactflow";

import { defaultAssignmentBy, defaultAssignmentType } from "@builder/ToolBar/utils.toolbar";
import type { ListBoxElement } from "@builder/common/Headless/Listbox";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { ASSIGNMENT_BY_NAMES, ASSIGNMENT_TYPE_NAMES } from "../constants.pma";

type Props = {
    nodeId: string;
};
export function usePMAConfig({ nodeId }: Props) {
    const currentNode = useReactFlow().getNode(nodeId) as Node<PMANode>;

    const { updateLocalNode } = useCustomsNodes();
    const assignment = get(currentNode, "data.configuration.assignment");

    const [assignmentTypeSelected, setAssignmentTypeSelected] = useState(defaultAssignmentType(assignment?.type));
    const [assignmentBySelected, setAssignmentBySelected] = useState(defaultAssignmentBy(assignment?.by, assignment?.type));

    const handleAssignmentTypeChange = (inputName: string) => (optionSelected: ListBoxElement) => {
        setAssignmentTypeSelected(optionSelected as ListBoxElement<ASSIGNMENT_TYPE_NAMES>);
        setAssignmentBySelected(undefined);

        const configurationToUpdate = {
            ...get(currentNode, "data.configuration"),
            assignment: {
                type: optionSelected.value,
                by: null,
            },
        };

        updateLocalNode(nodeId, { configuration: configurationToUpdate });
    };

    const handleAssignmentByChange = (inputName: string) => (optionSelected: ListBoxElement) => {
        setAssignmentBySelected(optionSelected as ListBoxElement<ASSIGNMENT_BY_NAMES>);

        const configurationToUpdate = {
            ...get(currentNode, "data.configuration"),
            assignment: {
                ...assignment,
                by: optionSelected.value,
            },
        };

        updateLocalNode(nodeId, { configuration: configurationToUpdate });
    };

    const handleComplementInput = (inputName: string) => (optionSelected: ListBoxElement) => {
        const configurationToUpdate = {
            ...get(currentNode, "data.configuration"),
            [inputName]: Number(optionSelected.value),
            assignment: {
                ...assignment,
            },
        };

        updateLocalNode(nodeId, { configuration: configurationToUpdate });
    };

    return { handleAssignmentTypeChange, handleAssignmentByChange, handleComplementInput, assignmentTypeSelected, assignmentBySelected };
}
